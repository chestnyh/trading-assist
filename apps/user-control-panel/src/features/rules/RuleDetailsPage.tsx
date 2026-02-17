import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useRules, Rule } from "../../app/contexts/RulesContext";
import { NotFound } from "../notFound/NotFound";

export function RuleDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { rules, getRuleById } = useRules();
	const [rule, setRule] = useState<Rule | null>(null);
	const [loading, setLoading] = useState(true);

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

			<section>
			<h3 className="block text-body-md font-medium text-text-secondary mb-2">Rule Body:</h3>
			<div className="bg-background border border-border rounded-xl p-4 overflow-auto max-h-[500px]">
				<pre className="text-sm font-mono text-accent">
				{JSON.stringify(rule.ruleBody || rule, null, 2)}
				</pre>
			</div>
			</section>
		</div>
		</div>
	);
}
