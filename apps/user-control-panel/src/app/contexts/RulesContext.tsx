import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Rule = {
  id: string;
  name: string;
  description: string;
  [key: string]: any;
};

type RulesContextType = {
  rules: Rule[];
  isLoading: boolean;
  mode: string;
  setMode: (mode: string) => void;
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
  const [mode, setMode] = useState<string>("table"); // table, edit, detail
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      // Get token from localStorage (or other secure storage)
      const token = localStorage.getItem("auth_token");
      const response = await fetch("http://localhost:3001/api/v1/rules", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/v1/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/v1/rules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/v1/rules/${id}`, {
        method: "DELETE",
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
    fetchRules();
  },[]);

  const value: RulesContextType = {
    rules,
    mode,
    setMode,
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
