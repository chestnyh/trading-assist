import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "../../shared/ui/forms/Input";
import { TextArea } from "../../shared/ui/forms/TextArea";
import { JsonEditorField } from "../../shared/ui/forms/JsonEditorField";
import { Button } from "../../shared/ui/buttons/Button";
import { extractFieldToMessageFromValidationError, isValidationError } from '@trading-assist/api-client';
import {
  ActionEditor,
  ActionNode,
  actionTreeToRuleBody,
  createActionNode,
  parseRuleBodyToActionTree,
} from "../../features/rules/components/action-editor";
import { CARD, FIELD_LABEL, FOCUS_RING, PAGE, PAGE_TITLE, WARNING_NOTE } from "../../shared/ui/styles";

interface RuleFormProps {
  initialData?: { name: string; description: string; ruleBody: unknown };
  onSubmit: (data: { name: string; description: string; ruleBody: unknown }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel: string;
  title: string;
}

type RuleFormData = {
  name: string;
  description: string;
  ruleBody: unknown | null;
};

type RuleBodyMode = 'ui' | 'json';

const MODE_BUTTON = `px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${FOCUS_RING}`;
const MODE_BUTTON_ACTIVE = 'bg-white text-neutral-950 shadow-sm dark:bg-neutral-950 dark:text-white';
const MODE_BUTTON_INACTIVE = 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white';

// Strip name/description from rule body for parsing (they're stored separately in form fields)
const stripMetadata = (ruleBody: unknown): unknown => {
  if (typeof ruleBody === 'object' && ruleBody !== null && !Array.isArray(ruleBody)) {
    const { name, description, ...rest } = ruleBody as Record<string, unknown>;
    return rest;
  }
  return ruleBody;
};

export function RuleForm({ initialData, onSubmit, onCancel, isLoading, submitLabel, title }: RuleFormProps) {
  const parsedInitialActionTree = initialData ? parseRuleBodyToActionTree(stripMetadata(initialData.ruleBody)) : null;
  const initialActionTree = parsedInitialActionTree ?? createActionNode();
  const initialMode: RuleBodyMode = initialData && !parsedInitialActionTree ? 'json' : 'ui';
  const [formData, setFormData] = useState<RuleFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    ruleBody: initialData?.ruleBody ?? actionTreeToRuleBody(initialActionTree),
  });
  const [mode, setMode] = useState<RuleBodyMode>(initialMode);
  const [actionTree, setActionTree] = useState<ActionNode>(initialActionTree);
  const [uiModeError, setUiModeError] = useState<string | null>(initialData && !parsedInitialActionTree ? 'Current rule body cannot be represented in UI mode. JSON mode is still available.' : null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      // Strip metadata before parsing for UI mode
      const cleanRuleBody = stripMetadata(initialData.ruleBody);
      const parsedActionTree = parseRuleBodyToActionTree(cleanRuleBody);
      setFormData({
        name: initialData.name,
        description: initialData.description,
        ruleBody: initialData.ruleBody ?? null,
      });
      setActionTree(parsedActionTree ?? createActionNode());
      setMode(parsedActionTree ? 'ui' : 'json');
      setUiModeError(parsedActionTree ? null : 'Current rule body cannot be represented in UI mode. JSON mode is still available.');
      return;
    }

    const emptyActionTree = createActionNode();
    setFormData({
      name: "",
      description: "",
      ruleBody: actionTreeToRuleBody(emptyActionTree),
    });
    setActionTree(emptyActionTree);
    setMode('ui');
    setUiModeError(null);
  }, [initialData]);

  const initialRuleBodyString = JSON.stringify(initialData?.ruleBody ?? null);
  const currentRuleBodyString = JSON.stringify(formData.ruleBody ?? null);

  const isDirty =
    formData.name !== (initialData?.name || "") ||
    formData.description !== (initialData?.description || "") ||
    currentRuleBodyString !== initialRuleBodyString;

  // Validate rule body for empty items in Add to Heap
  const validateRuleBody = useCallback((ruleBody: unknown): string | null => {
    if (typeof ruleBody !== 'object' || ruleBody === null) return null;

    const body = ruleBody as Record<string, unknown>;

    // Check if it's an add_to_heap action with empty items
    if (body.type === 'add_to_heap' && body.arguments) {
      const args = body.arguments as Record<string, unknown>;
      const items = args.items as Array<{ key?: string; value?: string }> | undefined;
      if (items && items.length > 0) {
        const hasEmptyItem = items.some(item =>
          !item || String(item.key ?? '').trim() === '' || String(item.value ?? '').trim() === ''
        );
        if (hasEmptyItem) {
          return 'Add to Heap has empty items. Please fill in all key-value pairs or remove empty items.';
        }
      }
    }

    // Recursively check nested actions (sequence, parallel, if_then, etc.)
    if (body.arguments && typeof body.arguments === 'object') {
      const args = body.arguments as Record<string, unknown>;
      for (const key of Object.keys(args)) {
        const argValue = args[key];
        if (Array.isArray(argValue)) {
          for (const item of argValue) {
            const error = validateRuleBody(item);
            if (error) return error;
          }
        } else if (typeof argValue === 'object' && argValue !== null) {
          const error = validateRuleBody(argValue);
          if (error) return error;
        }
      }
    }

    return null;
  }, []);

  // Check if rule body has validation errors (e.g., empty items in Add to Heap)
  const hasValidationError = useMemo(() => validateRuleBody(formData.ruleBody) !== null, [formData.ruleBody, validateRuleBody]);

  const handleSubmit = async () => {
    setErrors({});

    if (formData.ruleBody === null || formData.ruleBody === undefined) {
      setErrors({ rule: 'Rule body is required' });
      return;
    }

    // Validate for empty items in Add to Heap
    const validationError = validateRuleBody(formData.ruleBody);
    if (validationError) {
      setErrors({ rule: validationError });
      return;
    }

    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
        ruleBody: formData.ruleBody,
      });
    } catch (err) {
      const error = err as Error;
      const nextErrors: Record<string, string> = isValidationError(error)
        ? extractFieldToMessageFromValidationError(error)
        : {};

      if (Object.keys(nextErrors).length === 0) {
        const fallbackMessage = typeof error?.message === 'string' ? error.message : undefined;
        nextErrors.form = fallbackMessage || 'Failed to save rule';
      }

      setErrors(nextErrors);
    }
  };

  const handleModeChange = (nextMode: RuleBodyMode) => {
    if (nextMode === 'ui') {
      // Strip metadata before parsing for UI mode
      const cleanRuleBody = stripMetadata(formData.ruleBody);
      const parsedActionTree = parseRuleBodyToActionTree(cleanRuleBody);

      if (!parsedActionTree) {
        // If rule body is null/empty or not parseable, create a fresh empty action tree
        // instead of blocking the mode switch
        const emptyActionTree = createActionNode();
        setActionTree(emptyActionTree);
        setFormData({ ...formData, ruleBody: actionTreeToRuleBody(emptyActionTree) });
        setUiModeError(null);
      } else {
        setActionTree(parsedActionTree);
        setUiModeError(null);
      }
    }

    setMode(nextMode);
  };

  const handleActionTreeChange = (nextActionTree: ActionNode) => {
    const nextRuleBody = actionTreeToRuleBody(nextActionTree);
    setActionTree(nextActionTree);
    setFormData(prev => ({ ...prev, ruleBody: nextRuleBody }));
    if (errors.rule) setErrors(prev => (prev.rule ? { ...prev, rule: "" } : prev));
  };

  const handleJsonChange = useCallback((nextRuleBody: unknown) => {
    // Store the full rule body including name/description
    setFormData((prev) => ({ ...prev, ruleBody: nextRuleBody }));
    // But parse only the action part (without name/description)
    const cleanRuleBody = stripMetadata(nextRuleBody);
    const parsedActionTree = parseRuleBodyToActionTree(cleanRuleBody);
    if (parsedActionTree) {
      setActionTree(parsedActionTree);
      setUiModeError(null);
    } else {
      setUiModeError('Current rule body cannot be represented in UI mode. JSON mode is still available.');
    }
    setErrors((prev) => ({ ...prev, rule: "" }));
  }, []);

  return (
    <div className={PAGE}>
      <h1 className={`${PAGE_TITLE} mb-8`}>{title}</h1>

      {errors.form && (
        <div className="mb-4 p-4 rounded-xl bg-error/10 border border-error/30 text-sm text-error">
          {errors.form}
        </div>
      )}

      <div className={`${CARD} p-6 md:p-8`}>

        <Input
          label="Rule Name"
          id="rule-name"
          name="rule-name"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: "" });
          }}
          error={errors.name}
          required
        />

        <TextArea
          label="Rule Description"
          id="rule-description"
          name="rule-description"
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            if (errors.description) setErrors({ ...errors, description: "" });
          }}
          error={errors.description}
          rows={3}
          required
        />

        <div className="pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <label className={FIELD_LABEL}>
              Rule Body <span className="text-error">*</span>
            </label>
            <div className="flex gap-1 p-1 rounded-full bg-neutral-100 dark:bg-neutral-800 w-fit">
              <button
                type="button"
                onClick={() => handleModeChange('ui')}
                disabled={isLoading || !!uiModeError}
                aria-pressed={mode === 'ui'}
                className={`${MODE_BUTTON} ${mode === 'ui' ? MODE_BUTTON_ACTIVE : MODE_BUTTON_INACTIVE}`}
              >
                UI
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('json')}
                disabled={isLoading}
                aria-pressed={mode === 'json'}
                className={`${MODE_BUTTON} ${mode === 'json' ? MODE_BUTTON_ACTIVE : MODE_BUTTON_INACTIVE}`}
              >
                JSON
              </button>
            </div>
          </div>

          {uiModeError && (
            <div className={`mb-3 ${WARNING_NOTE}`}>
              {uiModeError}
            </div>
          )}

          {mode === 'ui' ? (
            <ActionEditor
              action={actionTree}
              onChange={handleActionTreeChange}
              onDelete={() => handleActionTreeChange(createActionNode())}
              readOnly={isLoading}
            />
          ) : (
            <JsonEditorField
              label=""
              id="rule"
              required
              disabled={isLoading}
              value={formData.ruleBody}
              onChange={handleJsonChange}
              error={errors.rule}
              mode="tree"
            />
          )}

          {mode === 'ui' && errors.rule && (
            <p className="mt-2 text-sm text-error">{errors.rule}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-8 sm:[&>div]:w-40">
        <Button
          text="Cancel"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        />
        <Button
          text={isLoading ? "Processing..." : submitLabel}
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || !isDirty || hasValidationError}
        />
      </div>
    </div>
  );
}