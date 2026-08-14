import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RuleSettingForm from './RuleSettingForm';
import { AuthProvider } from '../../../app/contexts/AuthContext';
import {
  rulesSettingsTagsControllerFindAllTags,
  rulesSettingsTagsControllerCreateTag,
} from '@trading-bot/api-client';

jest.mock('@trading-bot/api-client', () => {
  const actual = jest.requireActual('@trading-bot/api-client');
  return {
    ...actual,
    rulesSettingsTagsControllerFindAllTags: jest.fn(),
    rulesSettingsTagsControllerCreateTag: jest.fn(),
  };
});

const mockFindTags = rulesSettingsTagsControllerFindAllTags as jest.Mock;
const mockCreateTag = rulesSettingsTagsControllerCreateTag as jest.Mock;

const DETAILS_SCHEMA = [
  {
    key: 'email',
    label: 'EmailAddress',
    required: true,
    placeholder: 'user.name@some-domain.com',
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  },
];

describe('RuleSettingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.setItem('auth_token', 'token-123');
    window.localStorage.setItem(
      'user_data',
      JSON.stringify({ id: 1, email: 'a@b.c', nickname: 'n' })
    );
    mockFindTags.mockResolvedValue({ status: 200, data: [{ id: 1, name: 'existing-tag' }] });
  });

  const setup = (onSave = jest.fn(), onCancel = jest.fn()) => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <RuleSettingForm
          initialName=""
          initialCode=""
          detailsSchema={DETAILS_SCHEMA}
          onSave={onSave}
          onCancel={onCancel}
        />
      </AuthProvider>
    );
    return { user, onSave, onCancel };
  };

  it('validates required fields and disables Save until valid', async () => {
    const { user, onSave } = setup();

    const saveButton = screen.getByRole('button', { name: /Save/i });
    expect(saveButton).toBeDisabled();

    await user.type(screen.getByPlaceholderText('Insert Name here…'), 'My Setting');
    await user.type(screen.getByPlaceholderText('Insert Code here…'), 'MY_CODE');
    await user.type(screen.getByPlaceholderText('user.name@some-domain.com'), 'user@example.com');

    expect(saveButton).not.toBeDisabled();
    await user.click(saveButton);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'My Setting',
        code: 'MY_CODE',
        details: [{ label: 'EmailAddress', value: 'user@example.com' }],
      })
    );
  });

  it('shows validation errors for invalid email and empty required fields', async () => {
    const { user } = setup();

    await user.type(screen.getByPlaceholderText('Insert Name here…'), 'My Setting');
    await user.type(screen.getByPlaceholderText('Insert Code here…'), 'MY_CODE');
    await user.type(screen.getByPlaceholderText('user.name@some-domain.com'), 'not-an-email');

    const saveButton = screen.getByRole('button', { name: /Save/i });
    expect(saveButton).toBeDisabled();
    expect(screen.getByText('Invalid format')).toBeInTheDocument();
  });

  it('calls onCancel', async () => {
    const { user, onCancel } = setup();

    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('loads and selects existing tags from the API', async () => {
    const { user } = setup();

    // Open the tag picker
    const tagInput = screen.getByPlaceholderText('Search or add tags…');
    await user.click(tagInput);

    await waitFor(() => {
      expect(mockFindTags).toHaveBeenCalled();
    });

    const option = await screen.findByRole('button', { name: 'existing-tag' });
    await user.click(option);

    expect(screen.getByText('existing-tag')).toBeInTheDocument();
  });

  it('creates a new tag via the API', async () => {
    mockCreateTag.mockResolvedValue({ status: 201, data: { id: 2, name: 'brand-new' } });
    const { user } = setup();

    const tagInput = screen.getByPlaceholderText('Search or add tags…');
    await user.type(tagInput, 'brand-new');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockCreateTag).toHaveBeenCalledWith({ name: 'brand-new' });
    });
    expect(await screen.findByText('brand-new')).toBeInTheDocument();
  });

  it('removes a selected tag', async () => {
    mockFindTags.mockResolvedValue({ status: 200, data: [{ id: 1, name: 'foo' }] });
    const { user } = setup();

    const tagInput = screen.getByPlaceholderText('Search or add tags…');
    await user.click(tagInput);
    const option = await screen.findByRole('button', { name: 'foo' });
    await user.click(option);
    expect(screen.getByText('foo')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Remove tag foo/i }));
    expect(screen.queryByText('foo')).not.toBeInTheDocument();
  });

  it('shows "No options" when no tags match and none can be created', async () => {
    const { user } = setup();

    const tagInput = screen.getByPlaceholderText('Search or add tags…');
    await user.click(tagInput);

    // Wait for the initial empty fetch, then type a query that matches nothing.
    await waitFor(() => {
      expect(mockFindTags).toHaveBeenCalled();
    });
    await user.type(tagInput, 'zzz');

    // "Create" option is available for unmatched queries; type a query that is
    // an exact existing tag instead to force the "No options" state.
    mockFindTags.mockResolvedValue({ status: 200, data: [] });
    await user.clear(tagInput);
    await user.type(tagInput, 'zzz');
    await user.click(tagInput);

    expect(await screen.findByText(/Create “zzz”/i)).toBeInTheDocument();
  });
});
