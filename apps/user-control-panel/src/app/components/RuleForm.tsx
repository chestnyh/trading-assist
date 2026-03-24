import { useState, useEffect } from "react";
import { Input } from "../../shared/ui/forms/Input";
import { TextArea } from "../../shared/ui/forms/TextArea";
import { Button } from "../../shared/ui/buttons/Button";
import { extractFieldToMessageFromValidationError, isValidationError } from '@trading-bot/api-client';

interface RuleFormProps {
  initialData?: { name: string; description: string; rule: string };
  onSubmit: (data: { name: string; description: string; ruleBody: unknown }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel: string;
  title: string;
}

export function RuleForm({ initialData, onSubmit, onCancel, isLoading, submitLabel, title }: RuleFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    rule: initialData?.rule || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const isDirty =
    formData.name !== (initialData?.name || "") ||
    formData.description !== (initialData?.description || "") ||
    formData.rule !== (initialData?.rule || "");

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    let parsedRuleBody: unknown;
    try {
      parsedRuleBody = JSON.parse(formData.rule);
    } catch {
      newErrors.rule = "Invalid JSON format. Please check your syntax.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
        ruleBody: parsedRuleBody,
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

      <TextArea
        label="Rule (JSON Format)"
		id="rule"
		name="rule"
        placeholder='{ "key": "value" }'
        value={formData.rule}
        onChange={(e) => {
          setFormData({ ...formData, rule: e.target.value });
          if (errors.rule) setErrors({ ...errors, rule: "" });
        }}
        error={errors.rule}
        rows={10}
        required
      />

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