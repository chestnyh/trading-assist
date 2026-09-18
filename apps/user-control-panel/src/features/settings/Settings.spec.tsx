import { render, screen } from "@testing-library/react";
import Settings from "./Settings";
jest.mock('./components/service-groups/TelegramSettingsGroup', () => ({
  default: () => <div data-testid="group-telegram" />,
}));

jest.mock('./components/service-groups/EmailSettingsGroup', () => ({
  default: () => <div data-testid="group-email" />,
}));

jest.mock('./components/service-groups/DiscordSettingsGroup', () => ({
  default: () => <div data-testid="group-discord" />,
}));

jest.mock('./components/service-groups/SlackSettingsGroup', () => ({
  default: () => <div data-testid="group-slack" />,
}));

jest.mock('./components/service-groups/SmsTwilioSettingsGroup', () => ({
  default: () => <div data-testid="group-sms-twilio" />,
}));

jest.mock('./components/service-groups/OneSignalSettingsGroup', () => ({
  default: () => <div data-testid="group-one-signal" />,
}));

jest.mock('./components/service-groups/WhatsappBusinessSettingsGroup', () => ({
  default: () => <div data-testid="group-whatsapp-business" />,
}));

jest.mock('./components/service-groups/BinanceSettingsGroup', () => ({
  default: () => <div data-testid="group-binance" />,
}));

jest.mock('./components/service-groups/BybitSettingsGroup', () => ({
  default: () => <div data-testid="group-bybit" />,
}));

jest.mock('./components/service-groups/KrakenSettingsGroup', () => ({
  default: () => <div data-testid="group-kraken" />,
}));

const EXPECTED_GROUP = [
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