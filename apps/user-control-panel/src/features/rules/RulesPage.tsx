import { useEffect } from "react";
import { useRules } from "../../app/contexts/RulesContext";
import { Button } from "../../shared/ui/buttons/Button";
import { EmptyState } from "./EmptyState";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { RuleItem } from "../../app/components/RuleItem";
import { Pagination } from "../../app/components/Pagination";
import { ErrorAlert } from "../../shared/ui/feedback/ErrorAlert";
import { NotFound } from "../notFound/NotFound";

export function RulesPage() {
  const { rules, isLoading, fetchRules, totalCount, error } = useRules();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const LIMIT = 20;

  useEffect(() => {
    fetchRules(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && rules.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && rules.length === 0) {
    return (
      <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
        <ErrorAlert message={error} />
        <Button text="Retry" onClick={() => fetchRules(currentPage)} className="mt-4" />
      </div>
    );
  }

  if (totalCount === 0 && !isLoading) {
    return <EmptyState />;
  }

  if (rules.length === 0 && totalCount > 0 && !isLoading) {
    return (
      <NotFound />
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
      <h1 className="text-h4 text-primary mb-6">Your Rules</h1>

      <div className="mb-6">
        <Button
          text=""
          variant="primary"
          onClick={() => navigate("/rules/add")}
          leftIcon={<Plus size={32} strokeWidth={2.5} />}
        />
      </div>

      <div className={`flex flex-col gap-3 transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {rules.map((rule) => (
          <RuleItem key={rule.id} rule={rule} />
        ))}
      </div>

      {totalCount > 20 && (
        <div className="mt-8 border-t pt-6">
          <Pagination
            current={currentPage}
            total={totalCount}
            pageSize={LIMIT}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
