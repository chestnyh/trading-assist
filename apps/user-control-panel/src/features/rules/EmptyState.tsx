import { Button } from "../../shared/ui/buttons/Button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export function EmptyState() {
	const navigate = useNavigate();

	return (
		<div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
			<div className="mt-4 text-body-md text-text-secondary dark:text-[var(--color-text-secondary-dark)]">
				You don't have rules yet. Please press '+' bellow to add a rule
			</div>
			<Button
				text=""
				variant="primary"
				onClick={() => navigate("/rules/add")}
				leftIcon={<Plus size={30} strokeWidth={2} />}
			/>
		</div>
	)
}
