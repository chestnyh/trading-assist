import { Button } from "../../shared/ui/buttons/Button";
import { useNavigate } from "react-router-dom";
import { Plus, Book } from "lucide-react";
import { CARD, PAGE, PAGE_TITLE } from "../../shared/ui/styles";

export function EmptyState() {
	const navigate = useNavigate();

	return (
		<div className={PAGE}>
			<h1 className={PAGE_TITLE}>Your Rules</h1>
			<div className={`${CARD} mt-8 px-6 py-14 flex flex-col items-center text-center`}>
				<span className="flex items-center justify-center w-14 h-14 rounded-full bg-forest-300 text-brand-300 dark:bg-brand-300 dark:text-forest-300">
					<Book className="w-6 h-6" aria-hidden="true" />
				</span>
				<h2 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">
					No rules yet
				</h2>
				<p className="mt-2 max-w-md text-lg text-neutral-600 dark:text-neutral-400">
					You don't have rules yet. Create your first one from ready-made blocks.
				</p>
				<div className="mt-8 w-full max-w-xs">
					<Button
						text="Create rule"
						variant="primary"
						onClick={() => navigate("/rules/add")}
						leftIcon={<Plus />}
					/>
				</div>
			</div>
		</div>
	)
}
