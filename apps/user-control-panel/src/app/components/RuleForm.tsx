import { useState, useEffect } from "react";
import { Input } from "../../shared/ui/forms/Input";
import { TextArea } from "../../shared/ui/forms/TextArea";
import { JsonEditorField } from "../../shared/ui/forms/JsonEditorField";
import { Button } from "../../shared/ui/buttons/Button";
import { extractFieldToMessageFromValidationError, isValidationError } from '@trading-bot/api-client';
import {
  ActionEditor,
  ActionNode,
  actionTreeToRuleBody,
  createActionNode,
  parseRuleBodyToActionTree,
} from "../../features/rules/components/action-editor";

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

  const handleSubmit = async () => {
    setErrors({});

    if (formData.ruleBody === null || formData.ruleBody === undefined) {
      setErrors({ rule: 'Rule body is required' });
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
    setFormData({ ...formData, ruleBody: nextRuleBody });
    if (errors.rule) setErrors({ ...errors, rule: "" });
  };

  const handleJsonChange = (nextRuleBody: unknown) => {
    // Store the full rule body including name/description
    setFormData({ ...formData, ruleBody: nextRuleBody });
    // But parse only the action part (without name/description)
    const cleanRuleBody = stripMetadata(nextRuleBody);
    const parsedActionTree = parseRuleBodyToActionTree(cleanRuleBody);
    if (parsedActionTree) {
      setActionTree(parsedActionTree);
      setUiModeError(null);
    } else {
      setUiModeError('Current rule body cannot be represented in UI mode. JSON mode is still available.');
    }
    if (errors.rule) setErrors({ ...errors, rule: "" });
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
      <h1 className="text-h4 text-primary mb-6">{title}</h1>

	  {errors.form && (
				<div className="mb-4 p-3 bg-error/10 border border-error text-error rounded">
				{errors.form}
				</div>
			)}

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
          <label className="block text-body-md font-medium text-text-secondary">
            Rule Body <span className="text-error">*</span>
          </label>
          <div className="flex rounded-md border-2 border-border overflow-hidden w-fit">
            <button
              type="button"
              onClick={() => handleModeChange('ui')}
              disabled={isLoading || !!uiModeError}
              className={`px-4 py-2 text-sm ${mode === 'ui' ? 'bg-primary text-background' : 'bg-background text-primary'} disabled:opacity-50`}
            >
              UI
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('json')}
              disabled={isLoading}
              className={`px-4 py-2 text-sm ${mode === 'json' ? 'bg-primary text-background' : 'bg-background text-primary'}`}
            >
              JSON
            </button>
          </div>
        </div>

        {uiModeError && (
          <div className="mb-3 p-3 rounded-md border border-warning bg-warning/10 text-warning">
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
          <p className="mt-2 text-body-sm text-error dark:text-error">{errors.rule}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-start gap-4 mt-8">
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
          disabled={isLoading || !isDirty}
        />
      </div>
    </div>
  );
}