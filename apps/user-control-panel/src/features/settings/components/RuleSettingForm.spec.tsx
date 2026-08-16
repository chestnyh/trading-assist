import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RuleSettingForm from './RuleSettingForm';
import { useAuth } from '../../../app/contexts/AuthContext';

jest.mock('../../../app/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@trading-bot/api-client', () => ({
  rulesSettingsTagsControllerFindAllTags: jest.fn(),
  rulesSettingsTagsControllerCreateTag: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;

const schema = [
  { key: 'apiKey', label: 'API Key', required: true, placeholder: 'API Key' },
];

describe('RuleSettingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ token: 'test-token' });
  });

  it('renders the description textarea', () => {
    render(
      <RuleSettingForm
        detailsSchema={schema}
        onSave={jest.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText(/Describe this rule setting/i);
    expect(textarea).toBeInTheDocument();
  });

  it('includes the description in the onSave payload', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(
      <RuleSettingForm
        detailsSchema={schema}
        onSave={onSave}
      />
    );

    await user.type(screen.getByPlaceholderText(/Insert Name here/i), 'My Bot');
    await user.type(screen.getByPlaceholderText(/Insert Code here/i), 'BOT_01');
    await user.type(screen.getByPlaceholderText(/^API Key$/), 'secret-key');
    await user.type(screen.getByPlaceholderText(/Describe this rule setting/i), 'Rule for spot trading');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'My Bot',
        code: 'BOT_01',
        description: 'Rule for spot trading',
      })
    );
  });

  it('sends an empty description when the field is left blank', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(
      <RuleSettingForm
        detailsSchema={schema}
        onSave={onSave}
      />
    );

    await user.type(screen.getByPlaceholderText(/Insert Name here/i), 'My Bot');
    await user.type(screen.getByPlaceholderText(/Insert Code here/i), 'BOT_01');
    await user.type(screen.getByPlaceholderText(/^API Key$/), 'secret-key');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'My Bot',
        code: 'BOT_01',
        description: '',
      })
    );
  });

  it('pre-fills the description from initialDescription', () => {
    render(
      <RuleSettingForm
        detailsSchema={schema}
        initialDescription="Existing description"
        onSave={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText(/Describe this rule setting/i)).toHaveValue(
      'Existing description'
    );
  });
});
