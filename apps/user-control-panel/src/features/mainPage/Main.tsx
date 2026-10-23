import { Link } from 'react-router-dom';
import { HeroRuleMockup } from './HeroRuleMockup';
import { PhoneAlertsMockup } from './PhoneAlertsMockup';

const HOW_IT_WORKS_STEPS = [
  {
    title: 'Connect your services',
    description:
      'Add your exchange accounts (Binance, Bybit, Kraken) and where you want to be notified: Telegram, Discord, Slack, email or webhooks.',
    // link icon
    iconPath:
      'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  },
  {
    title: 'Create a rule',
    description:
      'Combine ready-made blocks such as schedules, price checks, conditions, notifications and orders into a rule that describes your strategy.',
    // adjustments icon
    iconPath:
      'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  },
  {
    title: 'Let it run',
    description:
      'Trading Assist checks the market for you and acts when your conditions are met. Follow every run in the rule’s execution logs.',
    // lightning icon
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
];

const EXCHANGES = [
  { name: 'Binance', logoUrl: '/logos/binance-mark.svg' },
  { name: 'Bybit', logoUrl: '/logos/bybit.jpg' },
  { name: 'Kraken', logoUrl: '/logos/kraken-purple.png' },
];

const NOTIFICATION_CHANNELS = [
  { name: 'Telegram', logoUrl: '/logos/telegram.png' },
  { name: 'Discord', logoUrl: '/logos/discord.svg' },
  { name: 'Slack', logoUrl: '/logos/slack.png' },
  { name: 'Email', logoUrl: '/logos/email.png' },
  { name: 'SMS', logoUrl: '/logos/twilio.svg' },
  { name: 'WhatsApp', logoUrl: '/logos/whatsapp-business.svg' },
  { name: 'Push', logoUrl: '/logos/onesignal.svg' },
  { name: 'Webhooks', logoUrl: '/logos/webhooks.png' },
];

const USE_CASES = [
  {
    title: 'Trend alert',
    description: 'Every morning, check whether BTCUSDT has closed higher for 10 days in a row and tell you when it has.',
    blocks: ['Schedule', 'Candles', 'Condition', 'Notify'],
  },
  {
    title: 'Price level alert',
    description: 'Watch a pair every minute and notify you the moment it crosses the price level you care about.',
    blocks: ['Interval', 'Price check', 'Condition', 'Notify'],
  },
  {
    title: 'Volatility watch',
    description: 'Get a heads-up when a coin moves more than 3% within an hour, up or down.',
    blocks: ['Interval', 'Candles', 'Condition', 'Notify'],
  },
  {
    title: 'Spot vs futures gap',
    description: 'Compare the spot and futures price of a pair and alert you when the gap gets unusually wide.',
    blocks: ['Interval', 'Spot price', 'Futures price', 'Condition', 'Notify'],
  },
];

function ServiceList({ label, services }: { label: string; services: { name: string; logoUrl: string }[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-[var(--color-text-secondary-dark)]">
        {label}
      </h3>
      <ul aria-label={label} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {services.map((service) => (
          <li
            key={service.name}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-[var(--color-border-dark)] bg-gray-50 dark:bg-[var(--color-bg-secondary-dark)] px-3 py-4"
          >
            <img src={service.logoUrl} alt="" className="w-8 h-8 object-contain rounded-md" />
            <span className="text-sm font-medium text-gray-900 dark:text-[var(--color-text-dark)]">{service.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Main() {
  return (
    <main>
      {/* Hero Section*/}
      <section className="py-12 lg:py-16 bg-white dark:bg-[var(--color-background-dark)]">
        <div className="mx-auto px-4 sm:px-8 lg:px-[100px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Column - Text Content */}
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 dark:text-[var(--color-text-dark)] leading-tight">
                Automate Your{' '}
                <span className="font-bold">Trading Strategy</span>
                {' '}Without Code
              </h1>
              <p className="text-lg text-gray-700 dark:text-[var(--color-text-secondary-dark)] max-w-2xl">
                Build rules from ready-made blocks: schedules, price checks, conditions, notifications and orders.
                Trading Assist watches the market for you and acts when your conditions are met.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/sign-up"
                  className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center"
                >
                  Get Started
                </Link>
                <a
                  href="#how-it-works"
                  className="bg-gray-100 text-gray-900 dark:bg-[var(--color-bg-secondary-dark)] dark:text-[var(--color-text-dark)] px-8 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:opacity-80 transition-colors flex items-center justify-center gap-2"
                >
                  See How It Works
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column - Rule Illustration */}
            <div className="flex-1 flex justify-center lg:justify-center">
              <HeroRuleMockup />
            </div>
          </div>
        </div>
      </section>

      {/* How it works?  */}
      <section id="how-it-works" className="scroll-mt-16 py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[var(--color-background-dark)]">
        <div className="mx-auto lg:px-[100px]">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-[var(--color-text-dark)] mb-4">
            How it works
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-[var(--color-text-secondary-dark)] max-w-2xl mx-auto mb-12">
            From idea to a running strategy in three steps.
          </p>
          <ol className="flex flex-col md:flex-row justify-center gap-8">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="bg-gray-100 dark:bg-[var(--color-bg-secondary-dark)] p-8 rounded-lg shadow-md flex-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.iconPath} />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-[var(--color-text-secondary-dark)]">
                      Step {index + 1}
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-[var(--color-text-dark)]">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-[var(--color-text-secondary-dark)] text-lg">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Notifications */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[var(--color-background-dark)]">
        <div className="mx-auto lg:px-[100px]">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
            {/* Left Section - Mobile Phone Mockup */}
            <div className="flex justify-center shrink-0">
              <PhoneAlertsMockup />
            </div>

            {/* Right Section - Notification Channels */}
            <div className="max-w-xl space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[var(--color-text-dark)]">
                Never miss a signal
              </h2>
              <p className="text-lg text-gray-600 dark:text-[var(--color-text-secondary-dark)]">
                Connect your exchange and your rules watch the market for you. You are notified the moment conditions
                are met, wherever you already are. No need to keep a chart open.
              </p>

              <ServiceList label="Exchanges" services={EXCHANGES} />
              <ServiceList label="Notification channels" services={NOTIFICATION_CHANNELS} />

              <Link
                to="/sign-up"
                className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Set Up Alerts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[var(--color-background-dark)]">
        <div className="mx-auto lg:px-[100px]">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-[var(--color-text-dark)] mb-4">
            What you can automate
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-[var(--color-text-secondary-dark)] max-w-2xl mx-auto mb-12">
            A few examples of rules you can build from the same blocks.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {USE_CASES.map((useCase) => (
              <li
                key={useCase.title}
                className="flex flex-col bg-gray-50 dark:bg-[var(--color-bg-secondary-dark)] p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[var(--color-text-dark)] mb-2">
                  {useCase.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-[var(--color-text-secondary-dark)] mb-6">
                  {useCase.description}
                </p>
                <ul aria-label={`${useCase.title} blocks`} className="mt-auto flex flex-wrap gap-2">
                  {useCase.blocks.map((block) => (
                    <li
                      key={block}
                      className="rounded-full border border-gray-200 dark:border-[var(--color-border-dark)] bg-white dark:bg-[var(--color-background-dark)] px-3 py-1 text-xs font-medium text-gray-700 dark:text-[var(--color-text-secondary-dark)]"
                    >
                      {block}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* News */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto px-[100px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Years Graph */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {/* Graph Area */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <svg viewBox="0 0 300 150" className="w-full h-32">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line key={y} x1="30" y1={20 + y} x2="280" y2={20 + y} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* X-axis labels */}
                  {['2016-1', '2016-3', '2016-5', '2016-7', '2016-9', '2016-11'].map((label, i) => (
                    <text key={i} x={40 + i * 48} y={145} fontSize="8" fill="#6b7280" textAnchor="middle">
                      {label}
                    </text>
                  ))}
                  {/* Y-axis labels */}
                  {[0, 50, 100, 150, 200, 250].map((val, i) => (
                    <text key={i} x="25" y={130 - i * 20} fontSize="8" fill="#6b7280" textAnchor="end">
                      {val}
                    </text>
                  ))}
                  {/* Red line */}
                  <polyline
                    points="40,110 88,90 136,70 184,30 232,50 280,80"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  {/* Blue line */}
                  <polyline
                    points="40,120 88,100 136,80 184,50 232,70 280,100"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Text and Icons */}
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-gray-700 flex-1">
                  Ready to dive in? Here's how you can start contributing to the Enigma Code-ai developer community.
                </p>
                <div className="flex flex-col gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 - Months Graph */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {/* Graph Area */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <svg viewBox="0 0 300 150" className="w-full h-32">
                  {/* Grid lines */}
                  {[0, 5, 10, 15, 20, 25, 30].map((y, i) => (
                    <line key={i} x1="30" y1={20 + i * 15} x2="280" y2={20 + i * 15} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* X-axis labels */}
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((label, i) => (
                    <text key={i} x={35 + i * 20} y={145} fontSize="8" fill="#6b7280" textAnchor="middle">
                      {label}
                    </text>
                  ))}
                  {/* Y-axis labels */}
                  {[-5, 0, 5, 10, 15, 20, 25, 30].map((val, i) => (
                    <text key={i} x="25" y={130 - i * 15} fontSize="8" fill="#6b7280" textAnchor="end">
                      {val}
                    </text>
                  ))}
                  {/* Red line */}
                  <polyline
                    points="35,120 55,110 75,100 95,85 115,70 135,55 155,45 175,40 195,45 215,55 235,70 255,85"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  {/* Blue line */}
                  <polyline
                    points="35,125 55,115 75,105 95,90 115,75 135,60 155,50 175,35 195,40 215,50 235,65 255,80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Text and Icons */}
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-gray-700 flex-1">
                  Access a wealth of resources to support your development journey with Enigma Code-ai.
                </p>
                <div className="flex flex-col gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 - Days Graph */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {/* Graph Area */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <svg viewBox="0 0 300 150" className="w-full h-32">
                  {/* Grid lines */}
                  {[0, 20, 40, 60, 80, 100].map((y, i) => (
                    <line key={i} x1="30" y1={20 + i * 20} x2="280" y2={20 + i * 20} stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  {/* X-axis labels */}
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => (
                    <text key={i} x={50 + i * 35} y={145} fontSize="8" fill="#6b7280" textAnchor="middle">
                      {label}
                    </text>
                  ))}
                  {/* Y-axis labels */}
                  {[0, 20, 40, 60, 80, 100].map((val, i) => (
                    <text key={i} x="25" y={130 - i * 20} fontSize="8" fill="#6b7280" textAnchor="end">
                      {val}
                    </text>
                  ))}
                  {/* Red line */}
                  <polyline
                    points="50,100 85,90 120,50 155,70 190,80 225,40 260,60"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  {/* Blue line */}
                  <polyline
                    points="50,110 85,50 120,60 155,80 190,90 225,70 260,80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Text and Icons */}
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-gray-700 flex-1">
                  Access a wealth of resources to support your development journey with Enigma Code-ai.
                </p>
                <div className="flex flex-col gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[var(--color-background-dark)]">
        <div className="mx-auto px-[100px]">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-[var(--color-text-dark)] mb-4">
              Frequently Asked <br /> Questions
            </h2>
            <p className="text-gray-600 dark:text-[var(--color-text-secondary-dark)]">
              Have questions about Enigma Code-ai? Here are some of the most common inquiries we receive from our users. If you don't find the answer you're looking for, feel free to contact us.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* FAQ Item 1 - Open */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">What is Enigma Code-ai?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="mt-2 text-gray-600">
                Have questions about Enigma Code-ai? Here are some of the most common inquiries we receive from our users. If you don't find the answer you're looking for, feel free to contact us.
              </p>
            </div>

            {/* FAQ Item 2 - Closed */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">How do I get started with Enigma Code-ai?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* FAQ Item 3 - Closed */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">What programming languages does Enigma Code-ai support?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* FAQ Item 4 - Closed */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">Can I use Enigma Code-ai for free?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* FAQ Item 5 - Closed */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">How does the AI-powered code completion work?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* FAQ Item 6 - Closed */}
            <div className="pb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">What if I need help or have a question?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white dark:bg-[var(--color-background-dark)]">
        <div className="mx-auto px-[100px]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-normal text-gray-900 dark:text-[var(--color-text-dark)] mb-4">
              Many users trust us
            </h2>
            <p className="text-2xl text-gray-900 dark:text-[var(--color-text-dark)] mb-10">
              join us
            </p>
            <div className="flex justify-center gap-6">
              <button className="bg-black text-white px-8 py-4 rounded-lg shadow-lg hover:bg-gray-800 transition-colors duration-300 font-medium">
                Get Started
              </button>
              <button className="bg-gradient-to-br from-gray-400 to-gray-600 text-white px-8 py-4 rounded-lg shadow-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-300 font-medium">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}