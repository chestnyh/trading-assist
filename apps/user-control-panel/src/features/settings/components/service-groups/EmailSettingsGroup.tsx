import SimpleServiceSettingsGroup from "./SimpleServiceSettingsGroup";
import type { DetailField } from "../RuleSetting";

const EMAIL_FIELDS_SCHEMA: DetailField[] = [
  {
    key: "email",
    label: "EmailAddress",
    required: true,
    pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    placeholder: "user.name@some-domain.com",
  },
];

export default function EmailSettingsGroup() {
  return (
    <SimpleServiceSettingsGroup
      serviceCode="EMAIL"
      name="Email"
      logoUrl="/logos/email.png"
      fieldsSchema={EMAIL_FIELDS_SCHEMA}
    />
  );
}