import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Pencil } from "lucide-react";
import { useRules, Rule } from "../../app/contexts/RulesContext";
import { useAuth } from "../../app/contexts/AuthContext";
import { JsonEditorField } from "../../shared/ui/forms/JsonEditorField";
import { NotFound } from "../notFound/NotFound";
import { useRuleLogs } from "./hooks/useRuleLogs";
import { LogsPanel } from "./components/LogsPanel";
import { ActionEditor, parseRuleBodyToActionTree } from "./components/action-editor";
import { Spinner } from "../../shared/ui/spiner/Spinner";
import { CARD, FOCUS_RING, PAGE, PAGE_LEAD, PAGE_TITLE, SECTION_LABEL, SMALL_BUTTON_SECONDARY } from "../../shared/ui/styles";

export function RuleDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { getRuleById } = useRules();
	const { isAuthenticated } = useAuth();
	const [rule, setRule] = useState<Rule | null>(null);
	const [loading, setLoading] = useState(true);

	const { logs, isConnected, isReconnecting, error } = useRuleLogs({
		ruleId: id ?? '',
		enabled: isAuthenticated,
	});

	useEffect(() => {
    const loadRule = async () => {
      setLoading(true);
		if (id) {
			const data = await getRuleById(id);
			setRule(data);
		}
		setLoading(false);
		};
		loadRule();
	}, [id, getRuleById]);

	if (loading)
		return <Spinner/>
	if (!rule) return (
		<NotFound />
	)

	const actionTree = parseRuleBodyToActionTree(rule.ruleBody);

	return (
		<div className={PAGE}>
			<button
				onClick={() => navigate("/rules")}
				className={`inline-flex items-center gap-1 rounded-full text-sm font-medium text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white mb-6 transition-colors ${FOCUS_RING}`}
			>
				<ChevronLeft size={18} />
				<span>Back</span>
			</button>

			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
				<div className="min-w-0">
					<p className={SECTION_LABEL}>Rule</p>
					<h1 className={`${PAGE_TITLE} mt-1 break-words`}>{rule.name}</h1>
					<p className={`${PAGE_LEAD} whitespace-pre-wrap`}>
						{rule.description || "No description provided."}
					</p>
				</div>
				<button
					type="button"
					onClick={() => navigate(`/rules/${rule.id}/update`)}
					className={`${SMALL_BUTTON_SECONDARY} h-10 shrink-0`}
				>
					<Pencil className="w-4 h-4" aria-hidden="true" />
					Edit rule
				</button>
			</div>

			<section className={`${CARD} p-6 md:p-8 mb-6`}>
				<h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">Rule body</h2>
				{actionTree && (
					<div className="mt-6">
						<h3 className={SECTION_LABEL}>Structured view</h3>
						<ActionEditor action={actionTree} readOnly />
					</div>
				)}
				<h3 className={`${SECTION_LABEL} mt-6`}>JSON view</h3>
				<JsonEditorField
					label=""
					id="rule-body"
					disabled
					value={rule.ruleBody || rule}
					mode="view"
				/>
			</section>

			<section>
				<h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-white mb-4">Execution logs</h2>
				<LogsPanel
					logs={logs}
					isConnected={isConnected}
					isReconnecting={isReconnecting}
					error={error}
				/>
			</section>
		</div>
	);
}
