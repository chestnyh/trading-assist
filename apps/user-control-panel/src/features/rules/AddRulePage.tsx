import { useNavigate } from "react-router-dom";
import { useRules } from "../../app/contexts/RulesContext";
import { RuleForm } from "../../app/components/RuleForm";

export function AddRulePage() {
	const navigate = useNavigate();
	const { addRule, isLoading } = useRules();

	const handleSave = async (data: { name: string; description: string; ruleBody: any }) => {
        const success = await addRule(data);
        if (success) {
            navigate("/rules");
        }
	}

	return (
		<RuleForm
            title="Adding Rule"
            onSubmit={handleSave}
            onCancel={() => navigate("/rules")}
            isLoading={isLoading}
            submitLabel="Save"
        />
	);
}
