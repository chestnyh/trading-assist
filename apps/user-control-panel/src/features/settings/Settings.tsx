import { useState, useEffect } from "react";
import ExternalServiceSettingsGroup, { DetailField } from "./components/ExternalServiceSettingsGroup";
import { externalServicesControllerFindAll, ExternalServiceResponseDto } from "@trading-bot/api-client";

export default function Settings() {
  const [services, setServices] = useState<ExternalServiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    externalServicesControllerFindAll()
      .then((response) => {
        if (response.status === 200) {
          setServices(response.data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch external services", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
     return <div className="p-12 text-center text-secondary">Loading settings...</div>;
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
      <h1 className="text-h4 text-primary mb-6">Rules Settings</h1>
      <div className="flex flex-col gap-3">
        {services.map((s) => (
          <ExternalServiceSettingsGroup
            key={s.code}
            name={s.name}
            logoUrl={s.logoUrl || undefined}
            logoKey={s.code}
            fieldsSchema={s.fieldsSchema as DetailField[]}
          />
        ))}
      </div>
    </div>
  );
}
