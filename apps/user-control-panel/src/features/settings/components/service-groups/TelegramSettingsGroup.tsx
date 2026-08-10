// apps/user-control-panel/src/features/settings/components/TelegramSettingsGroup.tsx
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import AddRulesSettingsButton from "../AddRulesSettingsButton";
import { ConfirmationModal } from "../../../../shared/ui/modals/ConfirmationModal";
import TelegramRuleSetting from "../TelegramRuleSetting";
import type { DetailField } from "../RuleSetting";
import { useServiceRuleSettings } from "../useServiceRuleSettings";

const TELEGRAM_FIELDS_SCHEMA: DetailField[] = [
  { key: "botToken", label: "BotToken", required: true, minLength: 45, maxLength: 50, placeholder: "Insert bot token…" },
  { key: "chatId", label: "ChatId", required: false, placeholder: "Insert chat id…" },
];

export default function TelegramSettingsGroup() {
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    expanded,
    setExpanded,
    settings,
    loading,
    error,
    hasMore,
    page,
    fetchSettingsPage,
    saveSetting,
    editSetting,
    cancelSetting,
    addNewSetting,
    deleteSetting,
    onDetailsChange,
  } = useServiceRuleSettings("TELEGRAM", TELEGRAM_FIELDS_SCHEMA);

  return (
    <div className="border-2 border-border rounded-lg overflow-hidden bg-bg-secondary/50">
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-background border border-border overflow-hidden">
          {!showPlaceholder ? (
            <img
              src="/logos/telegram.png"
              alt="Telegram logo"
              className="w-full h-full object-contain"
              onError={() => setShowPlaceholder(true)}
            />
          ) : (
            <span className="text-xs text-primary" data-logo-tag="logo-telegram">Logo</span>
          )}
        </div>

        <div className="flex-1 text-primary text-sm md:text-base">Telegram</div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="ml-auto h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent-hover/40 text-accent transition border border-border"
          aria-label={expanded ? "Collapse service group" : "Expand service group"}
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          {loading && <div className="text-secondary text-sm">Loading settings…</div>}
          {error && <div className="text-error text-sm">{error}</div>}

          <div className="flex flex-col gap-3">
            {settings.map((s, i) => (
              <div key={s.clientId} className="flex flex-col gap-2">
                <TelegramRuleSetting
                  setting={s}
                  fieldsSchema={TELEGRAM_FIELDS_SCHEMA}
                  setLoading={() => {/* */}}
                  setError={() => {/* */}}
                  onSave={(data) => saveSetting(s, i, data)}
                  onEdit={() => editSetting(i)}
                  onCancel={() => cancelSetting(s, i)}
                  onDelete={() => setDeletingIndex(i)}
                  onDetailsChange={onDetailsChange}
                />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-2">
              <button
                type="button"
                className="px-3 py-1 text-sm rounded-md border border-border hover:bg-accent-hover/40 text-accent transition"
                onClick={() => fetchSettingsPage(page + 1)}
                disabled={loading}
              >
                Load more
              </button>
            </div>
          )}

          <div className="mt-3">
            <AddRulesSettingsButton onClick={addNewSetting} />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deletingIndex !== null}
        onClose={() => !isDeleting && setDeletingIndex(null)}
        onConfirm={async () => {
          if (deletingIndex === null) return;
          const s = settings[deletingIndex];
          try {
            setIsDeleting(true);
            await deleteSetting(s.id, deletingIndex);
            setDeletingIndex(null);
          } finally {
            setIsDeleting(false);
          }
        }}
        isLoading={isDeleting}
      />
    </div>
  );
}