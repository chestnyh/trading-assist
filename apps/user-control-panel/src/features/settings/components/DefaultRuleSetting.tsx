import type { DetailField } from "./RuleSetting";
import RuleSetting from "./RuleSetting";

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
  fieldsSchema: DetailField[];
  onSave: (data: { name: string; code: string; tags: string[]; details: { label: string; value: string }[] }) => Promise<void>;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const { setting, fieldsSchema, onSave, onEdit, onCancel, onDelete } = props;

  return (
    <RuleSetting
      name={setting.name}
      code={setting.code}
      tags={setting.tags}
      details={setting.details}
      detailsSchema={fieldsSchema}
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
