import { useMemo, useState } from "react";
import {
  rulesSettingsControllerGetTelegramChatId,
  rulesSettingsControllerUpdateSetting,
  UpdateUserRuleSettingDto,
} from "@trading-bot/api-client";
import type { DetailField } from "./RuleSetting";

export type FlowProgressRenderer<TSetting> = (setting: TSetting) => JSX.Element | null;
export type FlowExtraRenderer<TSetting> = (setting: TSetting) => JSX.Element | null;

export type ExternalServiceFlowAdapter<TSetting> = {
  renderProgress: FlowProgressRenderer<TSetting>;
  renderExtra: FlowExtraRenderer<TSetting>;
  onSettingsLoaded?: (settings: TSetting[]) => void;
  onSettingCreated?: (setting: TSetting, apiResponse: any) => void;
  onSettingEdit?: (setting: TSetting) => void;
  onSettingCancelEdit?: (setting: TSetting) => void;
  onSettingRemoved?: (setting: TSetting) => void;
};

type TelegramStage = "create" | "receive" | "waiting" | "confirm" | "success";

type TelegramFlowState = {
  stage: TelegramStage;
  chatIdDraft: string;
  error: string | null;
};

type TelegramSettingShape = {
  clientId: string;
  id?: number;
  isNew?: boolean;
  isEditing?: boolean;
  details: { label: string; value: string }[];
};

const isTelegramService = (serviceName: string) => serviceName === "Telegram";

const getClientIdChatIdFromDetails = (fieldsSchema: DetailField[] | undefined, details: { label: string; value: string }[]) => {
  const chatIdLabel = (fieldsSchema || []).find((f) => f.key === "chatId")?.label;
  if (!chatIdLabel) return "";
  return details.find((d) => d.label === chatIdLabel)?.value || "";
};

const getClientIdBotTokenFromDetails = (fieldsSchema: DetailField[] | undefined, details: { label: string; value: string }[]) => {
  const botTokenLabel = (fieldsSchema || []).find((f) => f.key === "botToken")?.label;
  if (!botTokenLabel) return "";
  return details.find((d) => d.label === botTokenLabel)?.value || "";
};

export function useExternalServiceFlowAdapter<TSetting extends { clientId: string; id?: number; isNew?: boolean; isEditing?: boolean; details: { label: string; value: string }[] }>(params: {
  serviceName: string;
  fieldsSchema?: DetailField[];
  token: string | null;
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
  updateSettingDetails: (clientId: string, patch: { label: string; value: string }[]) => void;
}): ExternalServiceFlowAdapter<TSetting> {
  const { serviceName, fieldsSchema, token, setLoading, setError, updateSettingDetails } = params;
  const enabled = isTelegramService(serviceName);

  const [telegramFlowByClientId, setTelegramFlowByClientId] = useState<Record<string, TelegramFlowState>>({});

  const getTelegramFlow = (clientId: string): TelegramFlowState =>
    telegramFlowByClientId[clientId] ?? { stage: "create", chatIdDraft: "", error: null };

  const setTelegramFlow = (clientId: string, patch: Partial<TelegramFlowState>) => {
    setTelegramFlowByClientId((prev) => ({
      ...prev,
      [clientId]: {
        ...(prev[clientId] ?? { stage: "create", chatIdDraft: "", error: null }),
        ...patch,
      },
    }));
  };

  const TelegramProgressBar = ({ stage }: { stage: TelegramStage }) => {
    const stepIndex = stage === "create" ? 0 : stage === "receive" ? 1 : stage === "waiting" ? 2 : stage === "confirm" ? 3 : 4;
    const total = 4;
    const pct = Math.min(100, Math.max(0, Math.round((stepIndex / total) * 100)));
    return (
      <div className="h-3 w-full rounded-md border border-border bg-background overflow-hidden">
        <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
      </div>
    );
  };

  const adapter = useMemo<ExternalServiceFlowAdapter<TSetting>>(() => {
    if (!enabled) {
      return {
        renderProgress: () => null,
        renderExtra: () => null,
      };
    }

    return {
      onSettingsLoaded: (settings: TSetting[]) => {
        setTelegramFlowByClientId((prev) => {
          const next = { ...prev };
          for (const s of settings) {
            const existingChatId = getClientIdChatIdFromDetails(fieldsSchema, s.details);
            const botToken = getClientIdBotTokenFromDetails(fieldsSchema, s.details);

            const stage: TelegramStage = s.isNew
              ? "create"
              : s.isEditing
                ? "create"
                : existingChatId
                  ? "success"
                  : botToken
                    ? "receive"
                    : "create";

            next[s.clientId] = {
              stage,
              chatIdDraft: existingChatId,
              error: null,
            };
          }
          return next;
        });
      },

      onSettingCreated: (setting: TSetting) => {
        setTelegramFlow(setting.clientId, { stage: "receive", chatIdDraft: "", error: null });
      },

      onSettingEdit: (setting: TSetting) => {
        setTelegramFlow(setting.clientId, { stage: "create", error: null });
      },

      onSettingCancelEdit: (setting: TSetting) => {
        const existingChatId = getClientIdChatIdFromDetails(fieldsSchema, setting.details);
        const botToken = getClientIdBotTokenFromDetails(fieldsSchema, setting.details);
        setTelegramFlow(setting.clientId, {
          stage: existingChatId ? "success" : botToken ? "receive" : "create",
          chatIdDraft: existingChatId,
          error: null,
        });
      },

      onSettingRemoved: (setting: TSetting) => {
        setTelegramFlowByClientId((prev) => {
          const next = { ...prev };
          delete next[setting.clientId];
          return next;
        });
      },

      renderProgress: (setting: TSetting) => {
        if (!enabled) return null;
        return <TelegramProgressBar stage={getTelegramFlow(setting.clientId).stage} />;
      },

      renderExtra: (setting: TSetting) => {
        if (!enabled) return null;
        if (setting.isNew || setting.isEditing || !setting.id) return null;

        const flow = getTelegramFlow(setting.clientId);
        const chatIdLabel = (fieldsSchema || []).find((f) => f.key === "chatId")?.label;

        return (
          <div>
            {flow.stage === "receive" && (
              <div className="flex flex-col gap-3">
                <div className="text-gray-100 text-sm bg-black/30 rounded px-2 py-2">
                  Now we should provide Chat Id to bot so it can send you a message
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 w-fit rounded border border-border bg-black/20 hover:bg-black/30 text-gray-100 text-sm"
                  onClick={async () => {
                    if (!token) return;
                    setTelegramFlow(setting.clientId, { stage: "waiting", error: null });

                    try {
                      const res = await rulesSettingsControllerGetTelegramChatId(setting.id!, {
                        headers: { Authorization: `Bearer ${token}` },
                      });

                      if (res.status === 200) {
                        const receivedChatId = String(res.data.chatId);
                        setTelegramFlow(setting.clientId, {
                          stage: "confirm",
                          chatIdDraft: receivedChatId,
                          error: null,
                        });
                      }
                    } catch (e: any) {
                      const msg = e?.message ? String(e.message) : "Failed to receive chat id";
                      setTelegramFlow(setting.clientId, { stage: "receive", error: msg });
                    }
                  }}
                >
                  Receive Chat Id
                </button>
              </div>
            )}

            {flow.stage === "waiting" && (
              <div className="text-gray-100 text-sm bg-black/30 rounded px-2 py-2">
                Please send any message to the Telegram bot from the account you use to communicate with it.
              </div>
            )}

            {flow.stage === "confirm" && (
              <div className="flex flex-col gap-2">
                <div className="text-gray-100 text-sm bg-black/30 rounded px-2 py-2">
                  Check if chatId the same you received in telegram. If yes press Send, if not insert that one from telegram
                </div>
                <input
                  value={flow.chatIdDraft || ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTelegramFlow(setting.clientId, { chatIdDraft: v });
                  }}
                  className="w-full rounded-md border border-border bg-background text-primary px-3 py-2"
                  placeholder="Chat Id…"
                />
                <div className="flex items-center justify-start gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 w-40 rounded-md border-2 border-border bg-accent-hover/50 hover:bg-accent-hover text-primary transition"
                    onClick={async () => {
                      if (!token) return;

                      const chatIdValue = (getTelegramFlow(setting.clientId).chatIdDraft || "").trim();
                      const botTokenValue = getClientIdBotTokenFromDetails(fieldsSchema, setting.details);

                      const configuration: Record<string, any> = {};
                      if (botTokenValue) configuration["botToken"] = botTokenValue;
                      if (chatIdValue) configuration["chatId"] = chatIdValue;

                      const dto: UpdateUserRuleSettingDto = {
                        configuration,
                      };

                      setLoading(true);
                      setError(null);
                      setTelegramFlow(setting.clientId, { error: null });

                      try {
                        const res = await rulesSettingsControllerUpdateSetting(setting.id!, dto, {
                          headers: { Authorization: `Bearer ${token}` },
                        });

                        if (res.status === 200) {
                          if (chatIdLabel) {
                            const nextDetails = [...setting.details];
                            const idx = nextDetails.findIndex((d) => d.label === chatIdLabel);
                            if (idx >= 0) {
                              nextDetails[idx] = { ...nextDetails[idx], value: chatIdValue };
                            } else {
                              nextDetails.push({ label: chatIdLabel, value: chatIdValue });
                            }
                            updateSettingDetails(setting.clientId, nextDetails);
                          }
                          setTelegramFlow(setting.clientId, { stage: "success", error: null });
                        }
                      } catch (e: any) {
                        const msg = e?.message ? String(e.message) : "Failed to update setting";
                        setTelegramFlow(setting.clientId, { error: msg });
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {flow.stage === "success" && (
              <div className="text-gray-100 text-sm bg-black/30 rounded px-2 py-2">
                Your settings completely saved you can use it now
              </div>
            )}

            {flow.error && (
              <div className="text-error text-sm mt-2">{flow.error}</div>
            )}
          </div>
        );
      },
    };
  }, [enabled, fieldsSchema, setError, setLoading, telegramFlowByClientId, token, updateSettingDetails]);

  return adapter;
}
