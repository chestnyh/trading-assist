# TRADING BOT(PILOT NAME)

## Description

Crypto Insight Hub is a dynamic platform that gathers live data from top cryptocurrency exchanges, analyzes market trends, and generates key indicators and parameters. Designed for both individual traders and financial teams, the platform empowers users to set custom behaviors and automated actions based on real-time parameter shifts, making it easier to seize opportunities or mitigate risks. Through powerful analytics and configurable rules, Crypto Insight Hub transforms raw market data into actionable insights, giving users the tools to automate their strategies and optimize trading decisions.

## What the main components of the project

**Info Collector**. This module continuously gathers market data from various cryptocurrency exchanges. It aggregates real-time information, such as price fluctuations, trading volume, and other relevant metrics, and standardizes it for further analysis. The Info Collector is designed to be highly scalable, capable of integrating with multiple exchanges simultaneously to provide a comprehensive view of the crypto market.

**Actions Hub**. The Actions Hub serves as the central repository for all possible actions that users can trigger within the platform. It provides a structured catalog of pre-defined actions, such as placing buy/sell orders, sending notifications. Each action is thoroughly defined, including parameters, requirements, and potential outcomes, ensuring users understand how each action behaves when executed.

**DSL(Domain Specific Language) Handler**. The DSL (Domain-Specific Language) Handler is the customization core of the platform, providing users with a flexible way to define specific actions based on market conditions. This language is tailored for the platform's unique purpose—enabling users to create rule-based strategies without needing extensive coding knowledge.

Through the DSL, users can write conditions that specify how the platform should respond to changes in key parameters, such as price movements, trading volume, or volatility. The syntax is straightforward, allowing users to set logical operators (e.g., "AND," "OR") and threshold values to dictate when and how actions should be triggered. For instance, a user could set a rule like "If Bitcoin price increases by 5% within 24 hours AND volume exceeds a certain level, then trigger a buy action.".

The DSL Handler acts as a bridge between the **Info Collector** and **Actions Hub** components. It continuously processes the real-time market data received from the Info Collector, evaluates user-defined 
conditions against this data, and when conditions are met, triggers the corresponding actions from the Actions Hub. This integration enables automated responses to market conditions, allowing the platform 
to execute predefined strategies without manual intervention. 

For a comprehensive guide to our DSL syntax, operators, and examples, please refer to our [DSL Documentation](./DSL/main.md).
