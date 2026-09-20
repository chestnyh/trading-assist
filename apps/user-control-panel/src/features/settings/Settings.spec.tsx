import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Settings from "./Settings";
import {
  rulesSettingsControllerFindAllSettings,
  rulesSettingsControllerCreateSetting,
  rulesSettingsControllerUpdateSetting,
  rulesSettingsControllerRemoveSetting
} from "@trading-bot/api-client";

jest.mock("@trading-bot/api-client", () => ({
  rulesSettingsControllerFindAllSettings: jest.fn(),
  rulesSettingsControllerCreateSetting: jest.fn(),
  rulesSettingsControllerUpdateSetting: jest.fn(),
  rulesSettingsControllerRemoveSetting: jest.fn(),
  rulesSettingsControllerGetTelegramChatId: jest.fn(),
}));

const mockUseAuth = jest.fn();
jest.mock("../../app/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockFindAll = rulesSettingsControllerFindAllSettings as unknown as jest.Mock;
const mockCreate = rulesSettingsControllerCreateSetting as unknown as jest.Mock;
const mockUpdate = rulesSettingsControllerUpdateSetting as unknown as jest.Mock;
const mockRemove = rulesSettingsControllerRemoveSetting as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ token: "test-token" });
  mockFindAll.mockResolvedValue({ status: 200, data: [] });
});

const clickExpandToggle = async (groupName: string) => {
  const heading = await screen.findByText(groupName);
  const header = heading.closest("div")!.parentElement as HTMLElement;
  const toggle = within(header).getByRole("button", { name: /expand service group/i });

  await act(async () => {
    fireEvent.click(toggle);
  });
};

const expandGroup = async (groupName: string) => {
  await clickExpandToggle(groupName);
  await waitFor(() => {
    expect(screen.queryByText(/loading settings/i)).not.toBeInTheDocument();
  });
};

const makeRule = (overrides: Partial<any> = {}) => ({
  id: 1,
  name: "My Binance Alert",
  code: "BINANCE_ALERT_1",
  tags: ["prod"],
  description: "Sends alerts to Binance",
  configuration: {
    apiKey: "A".repeat(32),
    apiSecret: "B".repeat(64),
    baseUrl: "https://api.binance.com/v3",
  },
  ...overrides,
});

describe("Settings page (full integration, no group mocks)", () => {
  it("renders the page heading", () => {
    render(<Settings />);
    expect(screen.getByRole("heading", { name: /rules settings/i })).toBeInTheDocument();
  });

  it("renders every real service group by its display name, collapsed, with no fetch yet", () => {
    render(<Settings />);

    expect(screen.getByText("Telegram")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Discord Webhooks")).toBeInTheDocument();
    expect(screen.getByText("Slack Webhooks")).toBeInTheDocument();
    expect(screen.getByText("SMS (via Twilio)")).toBeInTheDocument();
    expect(screen.getByText("Push Notifications (One Signal)")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp Business API")).toBeInTheDocument();
    expect(screen.getByText("Binance")).toBeInTheDocument();
    expect(screen.getByText("Bybit")).toBeInTheDocument();
    expect(screen.getByText("Kraken")).toBeInTheDocument();
    expect(screen.getByText("Webhooks")).toBeInTheDocument();

    expect(mockFindAll).not.toHaveBeenCalled();
  });

  it("fetches and renders real settings only after a group is expanded (Binance)", async () => {
    mockFindAll.mockResolvedValueOnce({ status: 200, data: [makeRule()] });

    render(<Settings />);
    await expandGroup("Binance");

    await waitFor(() =>
      expect(mockFindAll).toHaveBeenCalledWith({ serviceCode: "BINANCE", page: 1, limit: 20 })
    );

    expect(await screen.findByText("My Binance Alert")).toBeInTheDocument();
    expect(screen.getByText("BINANCE_ALERT_1")).toBeInTheDocument();
    expect(screen.getByText("prod")).toBeInTheDocument();
  });

  it("shows a real loading state while the request is pending", async () => {
    let resolveFetch!: (value: unknown) => void;
    mockFindAll.mockReturnValueOnce(new Promise((resolve) => { resolveFetch = resolve; }));

    render(<Settings />);
    await clickExpandToggle("Binance");

    expect(await screen.findByText(/loading settings/i)).toBeInTheDocument();

    
    resolveFetch({ status: 200, data: [] });
    await waitFor(() => {
      expect(screen.queryByText(/loading settings/i)).not.toBeInTheDocument();
    });
  });

  it("shows a real error message when the fetch fails", async () => {
    mockFindAll.mockRejectedValueOnce(new Error("Network down"));

    render(<Settings />);
    await expandGroup("Binance");

    expect(await screen.findByText("Network down")).toBeInTheDocument();
  });

  it("adds, fills and saves a brand-new Binance setting through the real form", async () => {
    mockFindAll.mockResolvedValueOnce({ status: 200, data: [] });
    mockCreate.mockResolvedValue({ status: 201, data: { id: 99 } });

    render(<Settings />);
    await expandGroup("Binance");

    await waitFor(() => expect(mockFindAll).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: /add.*setting/i }));

    fireEvent.change(screen.getByPlaceholderText("Insert Name here…"), {
      target: { value: "New rule" },
    });
    fireEvent.change(screen.getByPlaceholderText("Insert Code here…"), {
      target: { value: "NEW_CODE" },
    });
    fireEvent.change(screen.getByPlaceholderText("Insert api key…"), {
      target: { value: "A".repeat(32) },
    });
    fireEvent.change(screen.getByPlaceholderText("Insert secret key…"), {
      target: { value: "B".repeat(64) },
    });
    fireEvent.change(screen.getByPlaceholderText("Insert base url…"), {
      target: { value: "https://api.binance.com/v3" },
    });

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).not.toBeDisabled();
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New rule",
          code: "NEW_CODE",
          serviceCode: "BINANCE",
          configuration: expect.objectContaining({
            apiKey: "A".repeat(32),
            apiSecret: "B".repeat(64),
            baseUrl: "https://api.binance.com/v3",
          }),
        })
      )
    );

    expect(await screen.findByText("New rule")).toBeInTheDocument();
  });

  it("keeps Save disabled while required Binance fields are invalid", async () => {
    mockFindAll.mockResolvedValueOnce({ status: 200, data: [] });

    render(<Settings />);
    await expandGroup("Binance");
    await waitFor(() => expect(mockFindAll).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: /add.*setting/i }));

    fireEvent.change(screen.getByPlaceholderText("Insert Name here…"), {
      target: { value: "New rule" },
    });
    fireEvent.change(screen.getByPlaceholderText("Insert Code here…"), {
      target: { value: "NEW_CODE" },
    });
    fireEvent.change(screen.getByPlaceholderText("Insert api key…"), {
      target: { value: "too-short" },
    });

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByText(/Length must be 32/)).toBeInTheDocument();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("deletes a Binance setting through the real ConfirmationModal", async () => {
    mockFindAll.mockResolvedValueOnce({ status: 200, data: [makeRule()] });
    mockRemove.mockResolvedValue({ status: 200 });

    render(<Settings />);
    await expandGroup("Binance");

    const item = await screen.findByText("My Binance Alert");
    const itemRoot = item.closest("div")!.parentElement!.parentElement!.parentElement as HTMLElement;
    fireEvent.click(within(itemRoot).getByRole("button", { name: /delete rule setting/i }));

    const modal = await screen.findByRole("dialog");
    expect(within(modal).getByText("Are you sure?")).toBeInTheDocument();

    fireEvent.click(within(modal).getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(mockRemove).toHaveBeenCalledWith(1));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.queryByText("My Binance Alert")).not.toBeInTheDocument();
  });
});

