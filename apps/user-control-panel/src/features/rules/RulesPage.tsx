import { useRules } from "../../app/contexts/RulesContext";
import { Button } from "../../shared/ui/buttons/Button";
import { EmptyState } from "./EmptyState";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export function RulesPage() {
  const { rules, isLoading } = useRules();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (rules.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
       <h1 className="text-h4 text-primary mb-6">Your Rules</h1>
       <Button
			text=""
			variant="primary"
			onClick={() => navigate("/rules/add")}
			leftIcon={<Plus size={30} strokeWidth={2} />}
		/>
		{/* There will be a list of rules here when we write it. */}
    </div>
  );
}
