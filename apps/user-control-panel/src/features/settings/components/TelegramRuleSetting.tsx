import { useEffect, useMemo, useState } from "react";
import {
  rulesSettingsControllerGetTelegramChatId,
  rulesSettingsControllerUpdateSetting,
  UpdateUserRuleSettingDto,
} from "@trading-bot/api-client";
import type { DetailField } from "./RuleSetting";
import RuleSetting from "./RuleSetting";
import type { SettingItem } from "./DefaultRuleSetting";

type TelegramStage = "create" | "receive" | "waiting" | "confirm" | "success";

const getValueByFieldKey = (
  fieldsSchema: DetailField[] | undefined,
  details: { label: string; value: string }[],
  key: string
) => {
  const label = (fieldsSchema || []).find((f) => f.key === key)?.label;
  if (!label) return "";
  return details.find((d) => d.label === label)?.value || "";
};

export default function TelegramRuleSetting(props: {
  setting: SettingItem;
  fieldsSchema?: DetailField[];
  token: string | null;
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
  onSave: (data: { name: string; code: string; tags: string[]; details: { label: string; value: string }[] }) => Promise<void>;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onDetailsChange: (clientId: string, nextDetails: { label: string; value: string }[]) => void;
}) {
  const {
    setting,
    fieldsSchema,
    token,
    setLoading,
    setError,
    onSave,
    onEdit,
    onCancel,
    onDelete,
    onDetailsChange,
  } = props;

  const chatIdLabel = useMemo(
    () => (fieldsSchema || []).find((f) => f.key === "chatId")?.label,
    [fieldsSchema]
  );

  const [stage, setStage] = useState<TelegramStage>("create");
  const [chatIdDraft, setChatIdDraft] = useState<string>("");
  const [flowError, setFlowError] = useState<string | null>(null);

  const visibleFieldsSchema = useMemo(() => {
    const includeChatId = stage === "success";
    return (fieldsSchema || []).filter((f) => {
      if (f.key === "baseUrl") return false;
      if (f.key === "chatId" && !includeChatId) return false;
      return true;
    });
  }, [fieldsSchema, stage]);

  const visibleDetails = useMemo(() => {
    const allowedLabels = new Set(visibleFieldsSchema.map((f) => f.label));
    return (setting.details || []).filter((d) => allowedLabels.has(d.label));
  }, [setting.details, visibleFieldsSchema]);

  useEffect(() => {
    if (setting.isNew || setting.isEditing || !setting.id) {
      setStage("create");
      setFlowError(null);
      return;
    }

    const existingChatId = getValueByFieldKey(fieldsSchema, setting.details, "chatId");
    const botToken = getValueByFieldKey(fieldsSchema, setting.details, "botToken");

    if (existingChatId) {
      setStage("success");
      setChatIdDraft(existingChatId);
      setFlowError(null);
      return;
    }

    if (botToken) {
      setStage("receive");
      setChatIdDraft("");
      setFlowError(null);
      return;
    }

    setStage("create");
    setChatIdDraft("");
    setFlowError(null);
  }, [fieldsSchema, setting.clientId, setting.details, setting.id, setting.isEditing, setting.isNew]);

  const progress = (() => {
    const stepIndex = stage === "create" ? 0 : stage === "receive" ? 1 : stage === "waiting" ? 2 : stage === "confirm" ? 3 : 4;
    const total = 4;
    const pct = Math.min(100, Math.max(0, Math.round((stepIndex / total) * 100)));
    return (
      <div className="h-3 w-full rounded-md border border-border bg-background overflow-hidden">
        <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
      </div>
    );
  })();

  const extra = useMemo(() => {
    if (setting.isNew || setting.isEditing || !setting.id) return null;

    return (
      <div>
        {stage === "receive" && (
          <div className="flex flex-col gap-3">
            <div className="text-gray-100 text-sm bg-black/30 rounded px-2 py-2">
              Now we should provide Chat Id to bot so it can send you a message
            </div>
            <button
              type="button"
              className="px-3 py-1.5 w-fit rounded border border-border bg-black/20 hover:bg-black/30 text-gray-100 text-sm"
              onClick={async () => {
                if (!token) return;
                setStage("waiting");
                setFlowError(null);

                try {
                  const res = await rulesSettingsControllerGetTelegramChatId(setting.id!, {
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  if (res.status === 200) {
                    const receivedChatId = String(res.data.chatId);
                    setStage("confirm");
                    setChatIdDraft(receivedChatId);
                    setFlowError(null);
                  }
                } catch (e: any) {
                  const msg = e?.message ? String(e.message) : "Failed to receive chat id";
                  setStage("receive");
                  setFlowError(msg);
                }
              }}
            >
              Receive Chat Id
            </button>
          </div>
        )}

        {stage === "waiting" && (
          <div className="text-gray-100 text-sm bg-black/30 rounded px-2 py-2">
            Please send any message to the Telegram bot from the account you use to communicate with it.
          </div>
        )}

        {stage === "confirm" && (
          <div className="flex flex-col gap-2">
            <div className="text-gray-100 text-sm bg-black/30 rounded px-2 py-2">
              Check if chatId the same you received in telegram. If yes press Send, if not insert that one from telegram
            </div>
            <input
              value={chatIdDraft || ""}
              onChange={(e) => {
                const v = e.target.value;
                setChatIdDraft(v);
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

                  const chatIdValue = (chatIdDraft || "").trim();
                  const botTokenValue = getValueByFieldKey(fieldsSchema, setting.details, "botToken");

                  const configuration: Record<string, any> = {};
                  if (botTokenValue) configuration["botToken"] = botTokenValue;
                  if (chatIdValue) configuration["chatId"] = chatIdValue;

                  const dto: UpdateUserRuleSettingDto = {
                    configuration,
                  };

                  setLoading(true);
                  setError(null);
                  setFlowError(null);

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
                        onDetailsChange(setting.clientId, nextDetails);
                      }

                      setStage("success");
                      setFlowError(null);
                    }
                  } catch (e: any) {
                    const msg = e?.message ? String(e.message) : "Failed to update setting";
                    setFlowError(msg);
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

        {stage === "success" && (
          <div className="text-gray-100 text-sm bg-black/30 rounded px-2 py-2">
            Your settings completely saved you can use it now
          </div>
        )}

        {flowError && (
          <div className="text-error text-sm mt-2">{flowError}</div>
        )}
      </div>
    );
  }, [chatIdDraft, chatIdLabel, flowError, fieldsSchema, onDetailsChange, setError, setLoading, setting.clientId, setting.details, setting.id, setting.isEditing, setting.isNew, stage, token]);

  return (
    <RuleSetting
      name={setting.name}
      code={setting.code}
      tags={setting.tags}
      details={visibleDetails}
      detailsSchema={visibleFieldsSchema}
      initiallyExpanded={stage === "receive" || stage === "waiting" || stage === "confirm"}
      mode={setting.isNew || setting.isEditing ? "edit" : "view"}
      topSlot={progress}
      extraSlot={extra}
      onSave={(data) => {
        void onSave(data);
      }}
      onEdit={onEdit}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  );
}
