import { useState, useEffect } from "react";
import ExternalServiceSettingsGroup, { DetailField } from "./components/ExternalServiceSettingsGroup";
import { 
  externalServicesControllerFindAll, 
  ExternalServiceResponseDto,
  RuleSettingResponseDto 
} from "@trading-bot/api-client";
import { useAuth } from "../../app/contexts/AuthContext";
import { ErrorAlert } from "../../shared/ui/feedback/ErrorAlert";
import { Spinner } from "../../shared/ui/spiner/Spinner";

export default function Settings() {
  const [services, setServices] = useState<ExternalServiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const servicesRes = await externalServicesControllerFindAll();

        if (servicesRes.status === 200) {
          setServices(servicesRes.data);
        }
      } catch (e: unknown) {
        
        if (e && typeof e === 'object' && 'status' in e && (e as any).status === 401) {
          logout();
        } else {
          let errorMessage = "Unable to load settings. Please try again later.";
          if (e && typeof e === "object" && "message" in e) {
            const message = String((e as any).message);
            if (message === "Failed to fetch" || message.includes("fetch")) {
              errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
            } else {
              errorMessage = message;
            }
          }
          setError(errorMessage);
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
     return <Spinner/>
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6 max-w-5xl mx-auto">
      <h1 className="text-h4 text-primary mb-6">Rules Settings</h1>
      <ErrorAlert message={error} />
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

          return (
            <ExternalServiceSettingsGroup
              key={s.code}
              name={s.name}
              logoUrl={logo}
              logoKey={s.code}
              fieldsSchema={schema}
              externalServiceId={s.id}
            />
          );
        })}
        {!error && !loading && services.length === 0 && (
          <div className="text-center text-secondary">No external services available.</div>
        )}
      </div>
    </div>
  );
}
