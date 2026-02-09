import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRules } from "../../app/contexts/RulesContext";
import { Input } from "../../shared/ui/forms/Input";
import { TextArea } from "../../shared/ui/forms/TextArea";
import { Button } from "../../shared/ui/buttons/Button";

export function AddRulePage() {
	const navigate = useNavigate();
	const { addRule, isLoading } = useRules();

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		rule: "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSave = async () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) newErrors.name = "Rule Name is required";
		else if (formData.name.length < 3) newErrors.name = "Rule name is not long enough (3+ chars).";

		if (!formData.description.trim()) newErrors.description = "Rule Description is required";
		else if (formData.description.length < 10) newErrors.description = "Rule description is not long enough (10+ chars)."

		if (!formData.rule.trim()) newErrors.rule = "Rule is required";

		try {
		if (formData.rule.trim()) {
			JSON.parse(formData.rule);
		}
		} catch (e) {
		newErrors.rule = "Invalid JSON format. Please check your syntax.";
		}

		if (Object.keys(newErrors).length > 0) {
		setErrors(newErrors);
		return;
		}

		try {
			const jsonContent = JSON.parse(formData.rule);

			const success = await addRule({
				name: formData.name,
				description: formData.description,
				ruleBody: jsonContent
			});

			if (success) {
			navigate("/rules");
			}
		} catch (e) {
			setErrors({ rule: "Invalid JSON format" });
		}
	}

	return (
		<div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
		<h1 className="text-h4 text-primary mb-6">Adding Rule</h1>

		{errors.form && (
			<div className="mb-4 p-3 bg-error/10 border border-error text-error rounded">
			{errors.form}
			</div>
		)}

		<Input
			label="Rule Name"
			id="rule-name"
			name="name"
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
			name="description"
			value={formData.description}
			onChange={(e) => {
				setFormData({ ...formData, description: e.target.value });
				if (errors.description) setErrors({...errors, description: ""})
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
			onClick={() => navigate("/rules")}
			disabled={isLoading}
			/>
			<Button
			text={isLoading ? "Saving..." : "Save"}
			variant="primary"
			onClick={handleSave}
			disabled={isLoading}
			/>
		</div>
		</div>
	);
}