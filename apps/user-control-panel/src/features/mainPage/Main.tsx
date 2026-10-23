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

const FAQ_ITEMS = [
  {
    question: 'What is Trading Assist?',
    answer:
      'A platform for automating your trading strategy without code. You build rules from ready-made blocks such as schedules, price checks, conditions, notifications and orders, and Trading Assist runs them for you.',
  },
  {
    question: 'Do I need to know how to code?',
    answer:
      'No. Rules are put together from blocks, so describing a strategy like "every morning, check BTCUSDT and tell me if it closed higher for 10 days" takes no programming.',
  },
  {
    question: 'Which exchanges and notification channels are supported?',
    answer:
      'You can connect Binance, Bybit and Kraken accounts, and get notified via Telegram, Discord, Slack, email, SMS, WhatsApp, push notifications or webhooks.',
  },
  {
    question: 'Can a rule place orders, or only send alerts?',
    answer:
      'Both. A rule can simply notify you, or include an order block that trades on your connected exchange account when its conditions are met. Nothing is traded unless your rule says so.',
  },
  {
    question: 'How do I connect my exchange account?',
    answer:
      'Create an API key in your exchange account and add it in Settings. Give the key only the permissions your rules need: read access is enough for alerts, and trading rights are only needed for rules that place orders.',
  },
  {
    question: 'How do I know what my rules did?',
    answer:
      'Every run of a rule is recorded in its execution logs, so you can see when it ran, what it checked and what actions it took.',
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

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[var(--color-background-dark)]">
        <div className="mx-auto lg:px-[100px]">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-[var(--color-text-dark)] mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-[var(--color-text-secondary-dark)] max-w-2xl mx-auto mb-12">
            The basics of building and running rules with Trading Assist.
          </p>
          <div className="max-w-4xl mx-auto divide-y divide-gray-200 dark:divide-[var(--color-border-dark)]">
            {FAQ_ITEMS.map((item, index) => (
              <details key={item.question} open={index === 0} className="group py-4">
                <summary className="flex justify-between items-center gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-[var(--color-text-dark)]">
                    {item.question}
                  </h3>
                  <svg
                    className="w-5 h-5 shrink-0 text-gray-500 dark:text-[var(--color-text-secondary-dark)] transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-[var(--color-text-secondary-dark)]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[var(--color-background-dark)]">
        <div className="max-w-3xl mx-auto text-center rounded-2xl bg-gray-50 dark:bg-[var(--color-bg-secondary-dark)] px-6 py-12 sm:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-[var(--color-text-dark)] mb-4">
            Your first rule is a few minutes away
          </h2>
          <p className="text-lg text-gray-600 dark:text-[var(--color-text-secondary-dark)] mb-8">
            Create an account, connect your exchange and notifications, and let your first rule watch the market for
            you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/sign-up"
              className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Create Your First Rule
            </Link>
            <Link
              to="/sign-in"
              className="px-4 py-3 font-medium text-gray-700 dark:text-[var(--color-text-secondary-dark)] hover:text-gray-900 dark:hover:text-[var(--color-text-dark)] transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}