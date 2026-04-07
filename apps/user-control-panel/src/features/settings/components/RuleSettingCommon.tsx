import RuleSetting, { DetailField } from "./RuleSetting";

type RuleSettingCommonProps = {
  name: string;
  code: string;
  tags?: string[];
  details?: { label: string; value: string }[];
  initiallyExpanded?: boolean;
  mode?: "view" | "edit";
  detailsSchema?: DetailField[];
  topSlot?: JSX.Element | null;
  extraSlot?: JSX.Element | null;
  onSave?: (data: { name: string; code: string; tags: string[]; details: { label: string; value: string }[] }) => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function RuleSettingCommon(props: RuleSettingCommonProps) {
  return <RuleSetting {...props} />;
}
