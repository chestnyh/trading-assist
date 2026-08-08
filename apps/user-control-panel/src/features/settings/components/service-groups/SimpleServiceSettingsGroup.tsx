import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import AddRulesSettingsButton from "../AddRulesSettingsButton";
import { ConfirmationModal } from "../../../../shared/ui/modals/ConfirmationModal";
import RuleSetting from "../RuleSetting";
import type { DetailField } from "../RuleSetting";
import { useServiceRuleSettings, ServiceCodeValue } from "../useServiceRuleSettings";

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
    <div className="border-2 border-border rounded-lg overflow-hidden bg-bg-secondary/50">
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-background border border-border overflow-hidden">
          {!showPlaceholder ? (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="w-full h-full object-contain"
              onError={() => setShowPlaceholder(true)}
            />
          ) : (
            <span className="text-xs text-primary" data-logo-tag={`logo-${name.toLowerCase()}`}>Logo</span>
          )}
        </div>

        <div className="flex-1 text-primary text-sm md:text-base">{name}</div>

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
              <RuleSetting
                key={s.clientId}
                name={s.name}
                code={s.code}
                tags={s.tags}
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