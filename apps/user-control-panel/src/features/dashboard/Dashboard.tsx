import { Link } from "react-router-dom";
import { ArrowRight, Book, Plus, Settings } from "lucide-react";
import { useAuth } from "../../app/contexts/AuthContext";
import { CARD, FOCUS_RING, PAGE, PAGE_LEAD, PAGE_TITLE, SECTION_LABEL } from "../../shared/ui/styles";

const QUICK_ACTIONS = [
    {
        title: "Create a rule",
        description: "Combine schedules, price checks, conditions and notifications into a new rule.",
        to: "/rules/add",
        Icon: Plus,
    },
    {
        title: "Your rules",
        description: "Review, edit and follow the execution logs of the rules you already have.",
        to: "/rules",
        Icon: Book,
    },
    {
        title: "Connect services",
        description: "Add exchange accounts and the channels where your rules notify you.",
        to: "/settings",
        Icon: Settings,
    },
];

const Dashboard = () => {
    const { user } = useAuth();
    const name = user?.name || user?.nickname;

    return (
        <div className={PAGE}>
            <p className={SECTION_LABEL}>Dashboard</p>
            <h1 className={`${PAGE_TITLE} mt-1`}>
                {name ? (
                    <>Welcome back, <span className="text-forest-200 dark:text-brand-300">{name}</span></>
                ) : (
                    "Welcome back"
                )}
            </h1>
            <p className={PAGE_LEAD}>Pick up where you left off.</p>

            <ul className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {QUICK_ACTIONS.map(({ title, description, to, Icon }) => (
                    <li key={to}>
                        <Link
                            to={to}
                            className={`${CARD} group h-full flex flex-col p-6 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 ${FOCUS_RING}`}
                        >
                            <span className="flex items-center justify-center w-11 h-11 rounded-full bg-forest-300 text-brand-300 dark:bg-brand-300 dark:text-forest-300">
                                <Icon className="w-5 h-5" aria-hidden="true" />
                            </span>
                            <h2 className="mt-5 text-lg font-semibold text-neutral-950 dark:text-white">{title}</h2>
                            <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
                            <ArrowRight
                                className="mt-6 w-5 h-5 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-forest-200 dark:group-hover:text-brand-300"
                                aria-hidden="true"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard
