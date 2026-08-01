import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRules } from "../../app/contexts/RulesContext";
import { RuleForm } from "../../app/components/RuleForm";
import { NotFound } from "../notFound/NotFound";
import { ErrorAlert } from "../../shared/ui/feedback/ErrorAlert";
import { Spinner } from "../../shared/ui/spiner/Spinner";

export function UpdateRulePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRuleById, updateRule, isLoading } = useRules();
  const [initialData, setInitialData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const rule = await getRuleById(id);
        if (rule) {
          setInitialData({
            name: rule.name,
            description: rule.description,
            ruleBody: rule.ruleBody,
          });
        }
      }
      setIsFetching(false);
    };
    loadData();
  }, [id, getRuleById]);

  const handleUpdate = async (data: any) => {
    if (!id) return;

    try {
      setUpdateError(null);
      const success = await updateRule(id, data);

      if (success) {
        navigate("/rules");
      }
    } catch (e: any) {
      const message = e?.message || "Failed to update rule";
      setUpdateError(message);
    }
  };

  if (isFetching) return <Spinner/> 
  if (!initialData) return <NotFound />;

  return (
    <>
      {updateError && (
        <div className="px-4 md:px-8 lg:px-12 max-w-5xl mx-auto">
          <ErrorAlert message={updateError} />
        </div>
      )}

      <RuleForm
        title="Update Rule"
        initialData={initialData}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/rules")}
        isLoading={isLoading}
        submitLabel="Update"
      />
    </>
  );
}