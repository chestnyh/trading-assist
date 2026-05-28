import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useRules, Rule } from "../../app/contexts/RulesContext";
import { useAuth } from "../../app/contexts/AuthContext";
import { JsonEditorField } from "../../shared/ui/forms/JsonEditorField";
import { NotFound } from "../notFound/NotFound";
import { useRuleLogs } from "./hooks/useRuleLogs";
import { LogsPanel } from "./components/LogsPanel";
import { ActionEditor, parseRuleBodyToActionTree } from "./components/action-editor";

export function RuleDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { getRuleById } = useRules();
	const { token } = useAuth();
	const [rule, setRule] = useState<Rule | null>(null);
	const [loading, setLoading] = useState(true);

	const { logs, isConnected, isReconnecting, error } = useRuleLogs({
		ruleId: id ?? '',
		token,
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
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
			</div>
			);
	if (!rule) return (
		<NotFound />
	)

	const actionTree = parseRuleBodyToActionTree(rule.ruleBody);

	return (
		<div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
		<button
			onClick={() => navigate("/rules")}
			className="flex items-center gap-1 text-accent hover:underline mb-6 transition-all text-primary"
		>
			<ChevronLeft size={20} />
			<span>Back</span>
		</button>

		<div className="bg-bg-secondary/30 border-2 border-border rounded-2xl p-6 md:p-10 shadow-sm">
			<section className="mb-8">
			<h3 className="block text-body-md font-medium text-text-secondary mb-2">Rule Name:</h3>
			<h1 className="text-2xl md:text-3xl font-bold text-primary">{rule.name}</h1>
			</section>

			<section className="mb-8">
			<h3 className="block text-body-md font-medium text-text-secondary mb-2">Description:</h3>
			<p className="text-primary leading-relaxed whitespace-pre-wrap">
				{rule.description || "No description provided."}
			</p>
			</section>

			<section className="mb-8">
			<h3 className="block text-body-md font-medium text-text-secondary mb-2">Rule Body:</h3>
			{actionTree && (
				<div className="mb-6">
					<h4 className="block text-body-md font-medium text-text-secondary mb-2">Structured View:</h4>
					<ActionEditor action={actionTree} readOnly />
				</div>
			)}
			<h4 className="block text-body-md font-medium text-text-secondary mb-2">JSON View:</h4>
			<JsonEditorField
				label=""
				id="rule-body"
				disabled
				value={rule.ruleBody || rule}
				mode="view"
			/>
			</section>

			<section>
			<h3 className="block text-body-md font-medium text-text-secondary mb-2">Execution Logs:</h3>
			<LogsPanel
				logs={logs}
				isConnected={isConnected}
				isReconnecting={isReconnecting}
				error={error}
			/>
			</section>
		</div>
		</div>
	);
}
