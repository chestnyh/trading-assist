# TRADING BOT

## The key idea

**Automated Trading Bot with Rule-Based Execution Engine**

This project is a comprehensive trading automation platform that allows users to create, manage, and execute complex trading strategies through a visual rule-based system. The core innovation lies in its modular action architecture that enables users to build sophisticated trading workflows without coding.

## Project description

This project aims to provide a highly flexible and configurable trading automation platform. At its core, the platform enables users to define their own trading strategies and workflows using a JSON-based Domain Specific Language (DSL). This approach allows users to combine a wide variety of pre-built configuration "chunks"—such as intervals, timeouts, conditions, notifiers, order execution, and price checkers—into custom rule sets tailored to their needs.

For example, a user could create a rule like: "Every day, check the price of BTCUSDT trading pair. If the price has been consistently increasing for 10 days, send me a notification on Telegram with text 'BTCUSDT grows for 10 days'."

Key features of the platform include:
- A modular, JSON-based configuration system that empowers users to build complex trading logic without coding.
- Integration with external APIs to gather necessary trading data.
- The ability to collect, store, and process information as needed.
- Event triggering and workflow execution based on user-defined JSON configurations.
- Multi-user support, allowing each user to manage their own independent set of trading rules.

In summary, the platform is designed to be a powerful, and extensible solution for automated trading(or treading helper), adaptable to a wide range of strategies and requirements.

## Team collaboration services
 - Git repository (Github) - https://github.com/chestnyh/trading-bot
 - Task tracker (Click up) - https://app.clickup.com/90151705756/v/o/s/90157055260
 - Massanger (Slack) - https://app.slack.com/
 - Video conferencing (Google meet) - https://meet.google.com/

## Technical stack
 - gitnub
 - nodejs
 - typescript
 - nx as monorepo
 - nestjs for backend services
 - react for frontend services
 - postgresql as main database
 - microservice architecture 

## First time set up for development
Complete setup guide for getting the trading bot platform running locally. Includes environment configuration, database setup, and service initialization.
📖 **[View Setup Documentation →](./docs/first-time-set-up-for-development.md)**
  
## Onboarding documentation
Essential guide for new team members joining the trading bot project. Covers project architecture, development workflows, coding standards, and contribution guidelines.
📚 **[View Onboarding Guide →](./docs/onboarding.md)**