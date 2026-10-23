import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import AddRulesSettingsButton from "../AddRulesSettingsButton";
import { ConfirmationModal } from "../../../../shared/ui/modals/ConfirmationModal";
import RuleSetting from "../RuleSetting";
import type { DetailField } from "../RuleSetting";
import { useServiceRuleSettings, ServiceCodeValue } from "../useServiceRuleSettings";
import { CARD, ICON_BUTTON, SMALL_BUTTON_SECONDARY } from "../../../../shared/ui/styles";

interface SimpleServiceSettingsGroupProps {
  serviceCode: ServiceCodeValue;
  name: string;
  logoUrl: string;
  fieldsSchema: DetailField[];
}

export default function SimpleServiceSettingsGroup({
  serviceCode,
  name,
  logoUrl,
  fieldsSchema,
}: SimpleServiceSettingsGroupProps) {
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
  } = useServiceRuleSettings(serviceCode, fieldsSchema);

  return (
    <div className={CARD}>
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="w-10 h-10 p-1.5 flex items-center justify-center rounded-xl bg-white border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {!showPlaceholder ? (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="w-full h-full object-contain"
              onError={() => setShowPlaceholder(true)}
            />
          ) : (
            <span className="text-xs text-neutral-500" data-logo-tag={`logo-${name.toLowerCase()}`}>Logo</span>
          )}
        </div>

        <div className="flex-1 text-base font-semibold text-neutral-950 dark:text-white">{name}</div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`ml-auto ${ICON_BUTTON}`}
          aria-label={expanded ? "Collapse service group" : "Expand service group"}
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-5">
          {loading && <div className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">Loading settings…</div>}
          {error && <div className="mb-3 text-sm text-error">{error}</div>}

          <div className="flex flex-col gap-3">
            {settings.map((s, i) => (
              <RuleSetting
                key={s.clientId}
                name={s.name}
                code={s.code}
                tags={s.tags}
                description={s.description}
                details={s.details}
                detailsSchema={fieldsSchema}
                mode={s.isNew || s.isEditing ? "edit" : "view"}
                onSave={(data) => {
                  void saveSetting(s, i, data);
                }}
                onEdit={() => editSetting(i)}
                onCancel={() => cancelSetting(s, i)}
                onDelete={() => setDeletingIndex(i)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-3">
              <button
                type="button"
                className={SMALL_BUTTON_SECONDARY}
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