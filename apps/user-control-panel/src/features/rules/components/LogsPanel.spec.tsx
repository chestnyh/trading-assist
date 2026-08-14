import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogsPanel } from './LogsPanel';
import { RuleLogEntry } from '../hooks/useRuleLogs';

const log: RuleLogEntry = {
  ruleId: 1,
  userId: 1,
  runId: 'run-abc-123',
  timestamp: '2026-08-13T10:00:00.000Z',
  level: 'info',
  type: 'text',
  message: 'Hello log',
};

const logWithData: RuleLogEntry = {
  ruleId: 1,
  userId: 1,
  runId: 'run-data-1',
  timestamp: '2026-08-13T10:05:00.000Z',
  level: 'error',
  type: 'json',
  data: { price: 123, symbol: 'BTCUSDT' },
};

describe('LogsPanel', () => {
  it('shows empty state when there are no logs', () => {
    render(
      <LogsPanel logs={[]} isConnected={false} isReconnecting={false} error={null} />
    );

    expect(screen.getByText('(0 entries)')).toBeInTheDocument();
    expect(screen.getByText('No logs yet. Waiting for rule execution...')).toBeInTheDocument();
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  });

  it('shows the live indicator when connected', () => {
    render(
      <LogsPanel logs={[]} isConnected={true} isReconnecting={false} error={null} />
    );

    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('shows the reconnecting indicator', () => {
    render(
      <LogsPanel logs={[]} isConnected={false} isReconnecting={true} error={null} />
    );

    expect(screen.getByText('Reconnecting...')).toBeInTheDocument();
  });

  it('renders log entries with level, timestamp and message', () => {
    render(
      <LogsPanel logs={[log]} isConnected={false} isReconnecting={false} error={null} />
    );

    expect(screen.getByText('[INFO]')).toBeInTheDocument();
    expect(screen.getByText('Hello log')).toBeInTheDocument();
    expect(screen.getByText('(1 entries)')).toBeInTheDocument();
    expect(screen.getByText(/run:run-abc/)).toBeInTheDocument();
  });

  it('expands and collapses log entries with data', async () => {
    const user = userEvent.setup();
    render(
      <LogsPanel logs={[logWithData]} isConnected={false} isReconnecting={false} error={null} />
    );

    // The collapsed row shows a truncated inline preview; the expanded view
    // renders a pretty-printed <pre> with the full JSON.
    expect(screen.queryByText(/"price": 123/)).toBeNull();

    // Buttons: [0] = pause auto-scroll, [1] = expand log entry
    const expandButton = screen.getAllByRole('button')[1];
    await user.click(expandButton);

    expect(screen.getByText(/"price": 123/)).toBeInTheDocument();
    expect(screen.getByText(/"symbol": "BTCUSDT"/)).toBeInTheDocument();

    await user.click(expandButton);
    expect(screen.queryByText(/"price": 123/)).toBeNull();
  });

  it('renders an error banner', () => {
    render(
      <LogsPanel
        logs={[]}
        isConnected={false}
        isReconnecting={false}
        error={new Error('Stream error')}
      />
    );

    expect(screen.getByText('Stream error')).toBeInTheDocument();
  });

  it('shows "Resume auto-scroll" after pausing autoscroll', async () => {
    const user = userEvent.setup();
    render(
      <LogsPanel logs={[log]} isConnected={false} isReconnecting={false} error={null} />
    );

    // Pause auto-scroll button (has title)
    await user.click(screen.getByTitle('Pause auto-scroll'));

    // The resume button matches by both its title and inner text
    expect(
      await screen.findAllByRole('button', { name: /resume auto-scroll/i })
    ).not.toHaveLength(0);
  });
});
