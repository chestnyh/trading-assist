import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRules } from "../../app/contexts/RulesContext";
import { RuleForm } from "../../app/components/RuleForm";
import { NotFound } from "../notFound/NotFound";

export function UpdateRulePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRuleById, updateRule, isLoading } = useRules();
  const [initialData, setInitialData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const rule = await getRuleById(id);
        if (rule) {
          setInitialData({
            name: rule.name,
            description: rule.description,
            rule: JSON.stringify(rule.ruleBody, null, 2),
          });
        }
      }
      setIsFetching(false);
    };
    loadData();
  }, [id, getRuleById]);

  const handleUpdate = async (data: any) => {
    if (id) {
      const success = await updateRule(id, data);
      if (success) navigate("/rules");
    }
  };

  if (isFetching) return <div className="p-10 text-center">Loading rule data...</div>;
  if (!initialData) return <NotFound />;

  return (
    <RuleForm
      title="Update Rule"
      initialData={initialData}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/rules")}
      isLoading={isLoading}
      submitLabel="Update"
    />
  );
}