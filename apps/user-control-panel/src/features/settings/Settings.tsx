import { useState, useEffect } from "react";
import ExternalServiceSettingsGroup, { DetailField } from "./components/ExternalServiceSettingsGroup";
import { 
  externalServicesControllerFindAll, 
  ExternalServiceResponseDto,
  rulesSettingsControllerFindAllSettings,
  RuleSettingResponseDto 
} from "@trading-bot/api-client";
import { useAuth } from "../../app/contexts/AuthContext";

export default function Settings() {
  const [services, setServices] = useState<ExternalServiceResponseDto[]>([]);
  const [ruleSettings, setRuleSettings] = useState<RuleSettingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
        const [servicesRes, settingsRes] = await Promise.all([
          externalServicesControllerFindAll(options),
          rulesSettingsControllerFindAllSettings(options)
        ]);

        if (servicesRes.status === 200) {
          setServices(servicesRes.data);
        }
        if (settingsRes.status === 200) {
          setRuleSettings(settingsRes.data);
        }
      } catch (error: unknown) {
        console.error("Failed to fetch settings", error);
        if (error && typeof error === 'object' && 'status' in error && (error as any).status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, logout]);

  if (loading) {
     return <div className="p-12 text-center text-secondary">Loading settings...</div>;
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
      <h1 className="text-h4 text-primary mb-6">Rules Settings</h1>
      <div className="flex flex-col gap-3">
        {services.map((s) => {
          const resolveLogoUrl = (url?: string | null) => {
            if (!url || typeof url !== "string") return undefined;
            if (/^https?:\/\//i.test(url)) return url;
            return url;
          };
          const logo = resolveLogoUrl(s.logoUrl);
          const schema =
            Array.isArray(s.fieldsSchema)
              ? (s.fieldsSchema as unknown as DetailField[])
              : undefined;
          
          const serviceRules = ruleSettings.filter(
            (r) => r.externalServiceId === s.id
          );

          return (
            <ExternalServiceSettingsGroup
              key={s.code}
              name={s.name}
              logoUrl={logo}
              logoKey={s.code}
              fieldsSchema={schema}
              ruleSettings={serviceRules}
            />
          );
        })}
      </div>
    </div>
  );
}
