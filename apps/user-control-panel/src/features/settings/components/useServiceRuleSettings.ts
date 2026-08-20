import { useEffect, useState } from "react";
import {
  rulesSettingsControllerFindAllSettings,
  rulesSettingsControllerCreateSetting,
  rulesSettingsControllerUpdateSetting,
  rulesSettingsControllerRemoveSetting,
  RuleSettingResponseDto,
  CreateUserRuleSettingDto,
  UpdateUserRuleSettingDto,
  ServiceCode,
} from "@trading-bot/api-client";
import { useAuth } from "../../../app/contexts/AuthContext";
import type { DetailField } from "../components/RuleSetting";

export type ServiceCodeValue =ServiceCode;

export type SettingItem = {
  clientId: string;
  id?: number;
  name: string;
  code: string;
  tags: string[];
  description?: string;
  details: { label: string; value: string }[];
  isNew?: boolean;
  isEditing?: boolean;
};

export type RuleSettingFormData = {
  name: string;
  code: string;
  tags: string[];
  description?: string;
  details: { label: string; value: string }[];
};

const LIMIT = 20;

export function useServiceRuleSettings(serviceCode: ServiceCodeValue, fieldsSchema: DetailField[]) {
  const [expanded, setExpanded] = useState(false);
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { token } = useAuth();

  const onDetailsChange = (clientId: string, nextDetails: { label: string; value: string }[]) => {
    setSettings((prev) => prev.map((s) => (s.clientId === clientId ? { ...s, details: nextDetails } : s)));
  };

  const mapRulesToSettings = (rules: RuleSettingResponseDto[]): SettingItem[] => {
    return rules.map((rule) => {
      const details = fieldsSchema.map((field) => ({
        label: field.label,
        value: (rule.configuration[field.key] as string) || "",
      }));

      return {
        clientId: `rs-${rule.id}`,
        id: rule.id,
        name: rule.name,
        code: rule.code,
        tags: rule.tags || [],
        description: rule.description || "",
        details,
        isNew: false,
        isEditing: false,
      };
    });
  };

  const fetchSettingsPage = async (nextPage: number) => {
    if (!token) return;
    try {
      setError(null);
      setLoading(true);

      const res = await rulesSettingsControllerFindAllSettings({ serviceCode, page: nextPage, limit: LIMIT });
      if (res.status === 200) {
        const mapped = mapRulesToSettings(res.data);
        if (mapped.length === 0) {
          setHasMore(false);
          return;
        }

        if (res.data.length === LIMIT) {
          const probe = await rulesSettingsControllerFindAllSettings(
            { serviceCode, page: nextPage + 1, limit: LIMIT } as any
          );
          setHasMore(probe.status === 200 && probe.data.length > 0);
        } else {
          setHasMore(false);
        }
        setSettings((prev) => (nextPage === 1 ? mapped : [...prev, ...mapped]));
        setPage(nextPage);
      }
    } catch (e: any) {
      const msg = e?.message ? String(e.message) : "Failed to load settings";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded && settings.length === 0) {
      setHasMore(false);
      fetchSettingsPage(1);
    }
  }, [expanded]);

  const buildConfigurationFromDetails = (details: { label: string; value: string }[]) => {
    const configuration: Record<string, any> = {};
    details.forEach((d) => {
      const field = fieldsSchema.find((f) => f.label === d.label);
      if (field) configuration[field.key] = d.value;
    });
    return configuration;
  };

  const saveNewSetting = async (
    s: SettingItem,
    i: number,
    data: RuleSettingFormData
  ) => {
    if (!token) return;

    const configuration = buildConfigurationFromDetails(data.details);
    const dto: CreateUserRuleSettingDto = {
      name: data.name,
      code: data.code,
      serviceCode,
      configuration,
      tags: data.tags,
      description: data.description,
    } 

    const res = await rulesSettingsControllerCreateSetting(dto);

    if (res.status === 201) {
      setSettings((prev) => {
        const next = [...prev];
        next[i] = { ...data, clientId: s.clientId, id: res.data.id, isNew: false, isEditing: false };
        return next;
      });
    }
  };

  const saveExistingSetting = async (
    s: SettingItem,
    i: number,
    data: RuleSettingFormData
  ) => {
    if (!token) return;
    if (!s.id) {
      setError("Setting ID is missing");
      return;
    }

    const configuration = buildConfigurationFromDetails(data.details);
    const dto: UpdateUserRuleSettingDto = {
      name: data.name,
      code: data.code,
      configuration,
      tags: data.tags,
      description: data.description,
    };

    const res = await rulesSettingsControllerUpdateSetting(s.id, dto);

    if (res.status === 200) {
      setSettings((prev) => {
        const next = [...prev];
        next[i] = { ...data, clientId: s.clientId, isEditing: false, id: s.id };
        return next;
      });
    }
  };

  const saveSetting = async (
    s: SettingItem,
    i: number,
    data: RuleSettingFormData
  ) => {
    try {
      if (!token) return;
      setLoading(true);
      setError(null);

      if (s.isNew) {
        await saveNewSetting(s, i, data);
      } else {
        await saveExistingSetting(s, i, data);
      }
    } catch (e: any) {
      setError(e.message || "Failed to save setting");
    } finally {
      setLoading(false);
    }
  };

  const editSetting = (index: number) => {
    setSettings((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isEditing: true };
      return next;
    });
  };

  const cancelSetting = (s: SettingItem, index: number) => {
    if (s.isNew) {
      setSettings((prev) => prev.filter((_, idx) => idx !== index));
      return;
    }
    setSettings((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isEditing: false };
      return next;
    });
  };

  const addNewSetting = () => {
    const clientId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto as any).randomUUID()
        : `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setSettings((prev) => [...prev, { clientId, name: "", code: "", tags: [], description: "", details: [], isNew: true }]);
  };

  const deleteSetting = async (id: number | undefined, index: number) => {
    if (!id) {
      setSettings((prev) => prev.filter((_, idx) => idx !== index));
      return;
    }
    if (!token) return;
    await rulesSettingsControllerRemoveSetting(id);
    setSettings((prev) => prev.filter((_, idx) => idx !== index));
  };

  return {
    expanded,
    setExpanded,
    settings,
    loading,
    error,
    hasMore,
    page,
    fetchSettingsPage,
    saveSetting,
    editSetting,
    cancelSetting,
    addNewSetting,
    deleteSetting,
    onDetailsChange,
  };
}