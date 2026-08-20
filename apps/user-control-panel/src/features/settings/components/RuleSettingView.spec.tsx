import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RuleSettingView from './RuleSettingView';

describe('RuleSettingView', () => {
  it('renders the description above the configuration details when present', async () => {
    const user = userEvent.setup();

    render(
      <RuleSettingView
        name="My Bot"
        code="BOT_01"
        tags={[]}
        description="My rule description"
        details={[{ label: 'API Key', value: 'secret' }]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /expand rule setting/i }));

    const description = screen.getByText('My rule description');
    const detailLabel = screen.getByText(/API Key/);

    // Description appears above the details in the DOM
    expect(description.compareDocumentPosition(detailLabel)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it('renders no description block when description is undefined', async () => {
    const user = userEvent.setup();

    render(
      <RuleSettingView
        name="My Bot"
        code="BOT_01"
        tags={[]}
        details={[{ label: 'API Key', value: 'secret' }]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /expand rule setting/i }));

    expect(screen.queryByText(/My rule description/)).not.toBeInTheDocument();
    expect(screen.getByText(/API Key/)).toBeInTheDocument();
  });

  it('renders no description block for an empty string description', async () => {
    const user = userEvent.setup();

    render(
      <RuleSettingView
        name="My Bot"
        code="BOT_01"
        tags={[]}
        description=""
        details={[{ label: 'API Key', value: 'secret' }]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /expand rule setting/i }));

    expect(screen.getByText(/API Key/)).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders no description block for a whitespace-only description', async () => {
    const user = userEvent.setup();

    render(
      <RuleSettingView
        name="My Bot"
        code="BOT_01"
        tags={[]}
        description="   "
        details={[{ label: 'API Key', value: 'secret' }]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /expand rule setting/i }));

    expect(screen.getByText(/API Key/)).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders nothing in the body when there is no description and no details', async () => {
    const user = userEvent.setup();

    render(
      <RuleSettingView
        name="My Bot"
        code="BOT_01"
        tags={[]}
        details={[]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /expand rule setting/i }));

    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    expect(screen.queryByText(/API Key/)).not.toBeInTheDocument();
  });
});
