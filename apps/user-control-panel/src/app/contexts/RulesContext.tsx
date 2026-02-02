import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from "libs/configs/src/lib/api-base-url";

export type Rule = {
  id: string;
  name: string;
  description: string;
  [key: string]: any;
};

type RulesContextType = {
  rules: Rule[];
  isLoading: boolean;
  selectedRule: Rule | null;
  setSelectedRule: (rule: Rule | null) => void;
  fetchRules: () => Promise<void>;
  addRule: (rule: Omit<Rule, "id">) => Promise<boolean>;
  updateRule: (id: string, updatedRule: Partial<Rule>) => Promise<boolean>;
  deleteRule: (id: string) => Promise<boolean>;
};

const RulesContext = createContext<RulesContextType | undefined>(undefined);

export const RulesProvider = ({ children }: { children: ReactNode }) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const { token } = useAuth();

  const fetchRules = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/rules`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch (error) {
      // Optionally handle error
    } finally {
      setIsLoading(false);
    }
  };

  const addRule = async (rule: Omit<Rule, "id">): Promise<boolean> => {
    if (!token) {
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rule),
      });
      if (response.ok) {
        await fetchRules();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRule = async (id: string, updatedRule: Partial<Rule>): Promise<boolean> => {
    if (!token) {
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/rules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedRule),
      });
      if (response.ok) {
        await fetchRules();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRule = async (id: string): Promise<boolean> => {
    if (!token) {
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/rules/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchRules();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRules();
    }
  }, [token]);

  const value: RulesContextType = {
    rules,
    selectedRule,
    setSelectedRule,
    isLoading,
    fetchRules,
    addRule,
    updateRule,
    deleteRule,
  };

  return (
    <RulesContext.Provider value={value}>
      {children}
    </RulesContext.Provider>
  );
};

export const useRules = (): RulesContextType => {
  const context = useContext(RulesContext);
  if (context === undefined) {
    throw new Error("useRules must be used within a RulesProvider");
  }
  return context;
};
