import { render, screen } from "@testing-library/react";
import Settings from "./Settings";

jest.mock("./components/service-groups/TelegramSettingsGroup", () => ({
  __esModule: true,
  default: () => <div data-testid="group-telegram" />,
}));

jest.mock("./components/service-groups/EmailSettingsGroup", () => ({
  __esModule: true,
  default: () => <div data-testid="group-email" />,
}));

jest.mock("./components/service-groups/DiscordSettingsGroup", () => ({
  __esModule: true,
  default: () => <div data-testid="group-discord" />,
}));

jest.mock("./components/service-groups/SlackSettingsGroup", () => ({
  __esModule: true,
  default: () => <div data-testid="group-slack" />,
}));

jest.mock("./components/service-groups/SmsTwilioSettingsGroup", () => ({
  __esModule: true,
  default: () => <div data-testid="group-sms-twilio" />,
}));

jest.mock("./components/service-groups/OneSignalSettingsGroup", () => ({
  __esModule: true,
  default: () => <div data-testid="group-one-signal" />,
}));

jest.mock("./components/service-groups/WhatsappBusinessSettingsGroup", () => ({
  __esModule: true,
  default: () => <div data-testid="group-whatsapp-business" />,
}));

jest.mock("./components/service-groups/BinanceSettingsGroup", () => ({
  __esModule: true,
  default: () => <div data-testid="group-binance" />,
}));

jest.mock("./components/service-groups/BybitSettingsGroup", () => ({
  __esModule: true,
  default: () => <div data-testid="group-bybit" />,
}));

jest.mock("./components/service-groups/KrakenSettingsGroup", () => ({
  __esModule: true,
  default: () => <div data-testid="group-kraken" />,
}));

jest.mock("./components/service-groups/WebhooksSettingsGroup", () => ({
  __esModule: true,
  default: () => <div data-testid="group-webhooks" />,
}));

const EXPECTED_GROUP = [
  "group-webhooks",
  "group-telegram",
  "group-email",
  "group-discord",
  "group-slack",
  "group-sms-twilio",
  "group-one-signal",
  "group-whatsapp-business",
  "group-binance",
  "group-bybit",
  "group-kraken",
];

describe("Settings page", () => {
  it("renders the page heading", () => {
    render(<Settings />);

    expect(
      screen.getByRole("heading", { name: /rules settings/i })
    ).toBeInTheDocument();
  });

  it("renders all service settings groups", () => {
    render(<Settings />);

    EXPECTED_GROUP.forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });
});