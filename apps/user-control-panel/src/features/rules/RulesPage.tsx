import { useEffect, useState } from "react";
import { useRules } from "../../app/contexts/RulesContext";
import { Button } from "../../shared/ui/buttons/Button";
import { EmptyState } from "./EmptyState";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { RuleItem } from "../../app/components/RuleItem";
import { Pagination } from "../../app/components/Pagination";
import { ErrorAlert } from "../../shared/ui/feedback/ErrorAlert";
import { NotFound } from "../notFound/NotFound";
import { ConfirmationModal } from "../../shared/ui/modals/ConfirmationModal";
import {Spinner} from '../../shared/ui/spiner/Spinner';
import { PAGE, PAGE_TITLE, PAGE_LEAD } from "../../shared/ui/styles";

export function RulesPage() {
  const { rules, isLoading, fetchRules, totalCount, error, deleteRule } = useRules();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const LIMIT = 20;
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchRules(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRuleId) return;

    try {
      setDeleteError(null);
      const success = await deleteRule(deletingRuleId);

      if (success) {
        setDeletingRuleId(null);
      }
    } catch (e: any) {
      const errorMessage = e.message || "Failed to connect to the server.";
      setDeleteError(errorMessage);

      setDeletingRuleId(null);
    }
  };

  if (isLoading && rules.length === 0) {
    return <Spinner/>
  }

  if (error && rules.length === 0) {
    return (
      <div className={PAGE}>
        <h1 className={PAGE_TITLE}>Your Rules</h1>
        <ErrorAlert message={error} />
        <div className="mt-4 max-w-xs">
          <Button text="Retry" onClick={() => fetchRules(currentPage)} />
        </div>
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
    <div className={PAGE}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className={PAGE_TITLE}>Your Rules</h1>
          <p className={PAGE_LEAD}>
            {totalCount} {totalCount === 1 ? "rule" : "rules"} watching the market for you.
          </p>
        </div>
        <div className="sm:w-44">
          <Button
            text="Add rule"
            variant="primary"
            onClick={() => navigate("/rules/add")}
            leftIcon={<Plus />}
          />
        </div>
      </div>

      {deleteError && (
        <div className="pb-6">
          <ErrorAlert message={deleteError} />
        </div>
      )}

      <div className={`flex flex-col gap-3 transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {rules.map((rule) => (
          <RuleItem
            key={rule.id}
            rule={rule}
            onDelete={() => {
              setDeleteError(null);
              setDeletingRuleId(rule.id);
            }}
          />
        ))}
      </div>

      {totalCount > 20 && (
        <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-6">
          <Pagination
            current={currentPage}
            total={totalCount}
            pageSize={LIMIT}
            onChange={handlePageChange}
          />
        </div>
      )}

      <ConfirmationModal
        isOpen={deletingRuleId !== null}
        onClose={() => {
          if (!isLoading) {
            setDeletingRuleId(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
        title="Delete Rule"
        message="Are you sure you want to delete this rule? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
