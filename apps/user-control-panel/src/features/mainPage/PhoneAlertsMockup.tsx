const ALERTS = [
  {
    rule: 'BTC trend alert',
    text: 'BTCUSDT grows for 10 days 📈',
    time: '09:00',
  },
  {
    rule: 'ETH dip buyer',
    text: 'ETHUSDT dropped 5% in 24h. Buy order placed on Bybit ✅',
    time: '13:42',
  },
  {
    rule: 'SOL volatility watch',
    text: 'SOLUSDT moved more than 3% in the last hour ⚡',
    time: '18:15',
  },
];

/**
 * Illustration for the notifications section: a phone receiving
 * notifications sent by the user's rules.
 */
export function PhoneAlertsMockup() {
  return (
    <figure className="relative w-[300px] h-[600px] bg-neutral-900 rounded-[40px] p-2 shadow-2xl">
      <figcaption className="sr-only">
        A phone showing notifications sent by Trading Assist rules during the day.
      </figcaption>

      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-900 rounded-b-2xl z-10" aria-hidden="true" />

      {/* Phone Screen */}
      <div className="w-full h-full bg-white dark:bg-neutral-950 rounded-[32px] overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="px-6 pt-1 pb-2 flex justify-between items-center text-xs text-neutral-950 dark:text-white" aria-hidden="true">
          <span className="font-semibold">18:16</span>
          {/* Battery */}
          <span className="flex items-center">
            <span className="w-5 h-2.5 border border-current rounded-sm p-px">
              <span className="block h-full w-3/4 bg-current rounded-[1px]" />
            </span>
            <span className="w-px h-1 bg-current rounded-r-sm" />
          </span>
        </div>

        {/* Chat Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-300 text-forest-300 shrink-0">
            {/* bell icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </span>
          <p className="text-sm font-semibold text-neutral-950 dark:text-white">Trading Assist</p>
        </div>

        {/* Alerts */}
        <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 p-4">
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mb-4">Today</p>
          <ul className="space-y-3">
            {ALERTS.map((alert) => (
              <li
                key={alert.rule}
                className="bg-white dark:bg-neutral-800 rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[90%]"
              >
                <p className="text-xs font-semibold text-forest-200 dark:text-brand-300 mb-1">
                  {alert.rule}
                </p>
                <p className="text-sm text-neutral-950 dark:text-white">{alert.text}</p>
                <p className="text-[10px] text-neutral-400 text-right mt-1">{alert.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  );
}
