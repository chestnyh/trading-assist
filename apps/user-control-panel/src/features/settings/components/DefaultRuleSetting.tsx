import type { DetailField } from "./RuleSetting";
import RuleSettingCommon from "./RuleSettingCommon";

export type SettingItem = {
  clientId: string;
  id?: number;
  name: string;
  code: string;
  tags: string[];
  details: { label: string; value: string }[];
  isNew?: boolean;
  isEditing?: boolean;
};

export default function DefaultRuleSetting(props: {
  setting: SettingItem;
  detailsSchema: DetailField[];
  onSave: (data: { name: string; code: string; tags: string[]; details: { label: string; value: string }[] }) => Promise<void>;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const { setting, detailsSchema, onSave, onEdit, onCancel, onDelete } = props;

  return (
    <RuleSettingCommon
      name={setting.name}
      code={setting.code}
      tags={setting.tags}
      details={setting.details}
      detailsSchema={detailsSchema}
      mode={setting.isNew || setting.isEditing ? "edit" : "view"}
      onSave={(data) => {
        void onSave(data);
      }}
      onEdit={onEdit}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  );
}
