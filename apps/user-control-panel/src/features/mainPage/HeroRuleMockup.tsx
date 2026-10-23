// bell icon
const NOTIFY_ICON_PATH =
  'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';

const RULE_BLOCKS = [
  {
    kind: 'Schedule',
    text: 'Every day at 09:00',
    // clock icon
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    kind: 'Price check',
    text: 'BTCUSDT on Binance',
    // bar chart icon
    iconPath:
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    kind: 'Condition',
    text: 'Price rising for 10 days',
    // trending up icon
    iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  },
  {
    kind: 'Notify',
    text: 'Send notification',
    iconPath: NOTIFY_ICON_PATH,
  },
];

/**
 * Illustration for the hero section: an example rule built from blocks
 * and the notification it produces.
 */
export function HeroRuleMockup() {
  return (
    <figure className="relative w-full max-w-lg pb-10">
      <figcaption className="sr-only">
        Example rule: every day check the BTCUSDT price on Binance and, if it has been rising for 10 days, send a
        notification.
      </figcaption>

      {/* Rule card */}
      <div className="rounded-2xl border border-gray-200 dark:border-[var(--color-border-dark)] bg-white dark:bg-[var(--color-bg-secondary-dark)] shadow-xl p-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-[var(--color-text-secondary-dark)]">
              Rule
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-[var(--color-text-dark)]">BTC trend alert</p>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
            Active
          </span>
        </div>

        <ol className="space-y-3">
          {RULE_BLOCKS.map((block, index) => (
            <li key={block.kind} className="relative flex items-center gap-4">
              {/* Connector between blocks */}
              {index < RULE_BLOCKS.length - 1 && (
                <span
                  className="absolute left-5 top-[calc(50%+20px)] h-6 w-px bg-gray-300 dark:bg-[var(--color-border-dark)]"
                  aria-hidden="true"
                />
              )}
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-[var(--color-background-dark)] text-gray-900 dark:text-[var(--color-text-dark)] shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={block.iconPath} />
                </svg>
              </span>
              <div className="flex-1 rounded-lg border border-gray-200 dark:border-[var(--color-border-dark)] px-4 py-2">
                <p className="text-xs text-gray-500 dark:text-[var(--color-text-secondary-dark)]">{block.kind}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-[var(--color-text-dark)]">{block.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Notification produced by the rule */}
      <div className="absolute bottom-0 right-4 sm:-right-6 w-72 rounded-xl border border-gray-200 dark:border-[var(--color-border-dark)] bg-white dark:bg-[var(--color-bg-secondary-dark)] shadow-2xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={NOTIFY_ICON_PATH} />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-[var(--color-text-dark)]">Trading Assist</p>
            <p className="text-xs text-gray-500 dark:text-[var(--color-text-secondary-dark)]">Notification · now</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-[var(--color-text-secondary-dark)]">BTCUSDT grows for 10 days 📈</p>
      </div>
    </figure>
  );
}
