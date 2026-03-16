import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from "libs/configs/src/lib/api-base-url";
import { customInstance } from "@trading-bot/api-client";

export type Rule = {
  id: string;
  name: string;
  description: string;
  [key: string]: any;
};

type RulesContextType = {
  rules: Rule[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  selectedRule: Rule | null;
  setSelectedRule: (rule: Rule | null) => void;
  fetchRules: (page?: number) => Promise<void>;
  getRuleById: (id: string) => Promise<Rule | null>;
  addRule: (rule: Omit<Rule, "id">) => Promise<boolean>;
  updateRule: (id: string, updatedRule: Partial<Rule>) => Promise<boolean>;
  deleteRule: (id: string) => Promise<boolean>;
};

const RulesContext = createContext<RulesContextType | undefined>(undefined);

export const RulesProvider = ({ children }: { children: ReactNode }) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const { token } = useAuth();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage] = useState<number>(1);
  const LIMIT = 20;

  const fetchRules = async (page: number = 1) => {
    setError(null);
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {

      const response = await fetch(
        `http://localhost:3001/api/v1/rules?page=${page}&limit=${LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setRules(data.rules);
      setTotalCount(data.total);

    } catch (error) {
      console.error("Fetch rules failed", error);
      setRules([]);
      setError("Failed to load rules. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRuleById = async (id: string): Promise<Rule | null> => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/rules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch rule details", error);
      return null;
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
        await fetchRules(currentPage);
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
      await customInstance(`http://localhost:3001/api/v1/rules/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedRule),
      });

      await fetchRules(currentPage);
      return true;

    } catch (error: any) {
      throw error;
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
      await customInstance(`http://localhost:3001/api/v1/rules/${id}`, {
        method: "DELETE",
      });
      await fetchRules(currentPage);
      return true;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules(currentPage);
  }, [currentPage]);

  const value: RulesContextType = {
    rules,
    totalCount,
    currentPage,
    selectedRule,
    setSelectedRule,
    isLoading,
    error,
    fetchRules,
    getRuleById,
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
