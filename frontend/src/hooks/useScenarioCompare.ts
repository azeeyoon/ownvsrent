import { useState, useCallback, useEffect, useRef } from 'react';
import { calculate, type CalculatorResults } from '../lib/api';
import type { CalculatorInputs } from '../lib/defaults';

interface ScenarioState {
  a: CalculatorInputs;
  b: CalculatorInputs;
}

interface ScenarioResults {
  a: CalculatorResults | null;
  b: CalculatorResults | null;
}

interface UseScenarioCompareReturn {
  enabled: boolean;
  toggle: () => void;
  inputs: ScenarioState;
  setScenarioInput: <K extends keyof CalculatorInputs>(
    scenario: 'a' | 'b',
    key: K,
    value: CalculatorInputs[K]
  ) => void;
  results: ScenarioResults;
  loading: { a: boolean; b: boolean };
  activeTab: 'a' | 'b';
  setActiveTab: (tab: 'a' | 'b') => void;
}

export function useScenarioCompare(
  baseInputs: CalculatorInputs
): UseScenarioCompareReturn {
  const [enabled, setEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'a' | 'b'>('a');
  const [inputs, setInputs] = useState<ScenarioState>({
    a: baseInputs,
    b: { ...baseInputs },
  });
  const [results, setResults] = useState<ScenarioResults>({ a: null, b: null });
  const [loading, setLoading] = useState({ a: false, b: false });
  const debounceRef = useRef<{
    a: ReturnType<typeof setTimeout> | null;
    b: ReturnType<typeof setTimeout> | null;
  }>({
    a: null,
    b: null,
  });

  const setScenarioInput = useCallback(
    <K extends keyof CalculatorInputs>(
      scenario: 'a' | 'b',
      key: K,
      value: CalculatorInputs[K]
    ) => {
      setInputs((prev) => ({
        ...prev,
        [scenario]: { ...prev[scenario], [key]: value },
      }));
    },
    []
  );

  const runCalculation = useCallback(
    async (scenario: 'a' | 'b', currentInputs: CalculatorInputs) => {
      setLoading((prev) => ({ ...prev, [scenario]: true }));
      try {
        const data = await calculate(currentInputs);
        setResults((prev) => ({ ...prev, [scenario]: data }));
      } catch {
        // Silent fail - results stay null
      } finally {
        setLoading((prev) => ({ ...prev, [scenario]: false }));
      }
    },
    []
  );

  // Sync scenario A with base inputs when compare mode is disabled
  useEffect(() => {
    if (!enabled) {
      setInputs((prev) => ({
        ...prev,
        a: baseInputs,
        b: { ...baseInputs },
      }));
    }
  }, [baseInputs, enabled]);

  // Debounced calculation for scenario A
  useEffect(() => {
    if (!enabled) return;
    if (debounceRef.current.a) clearTimeout(debounceRef.current.a);
    debounceRef.current.a = setTimeout(() => runCalculation('a', inputs.a), 300);
    return () => {
      if (debounceRef.current.a) clearTimeout(debounceRef.current.a);
    };
  }, [inputs.a, enabled, runCalculation]);

  // Debounced calculation for scenario B
  useEffect(() => {
    if (!enabled) return;
    if (debounceRef.current.b) clearTimeout(debounceRef.current.b);
    debounceRef.current.b = setTimeout(() => runCalculation('b', inputs.b), 300);
    return () => {
      if (debounceRef.current.b) clearTimeout(debounceRef.current.b);
    };
  }, [inputs.b, enabled, runCalculation]);

  // Initial calculation when enabling
  useEffect(() => {
    if (enabled) {
      runCalculation('a', inputs.a);
      runCalculation('b', inputs.b);
    }
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(() => setEnabled((prev) => !prev), []);

  return {
    enabled,
    toggle,
    inputs,
    setScenarioInput,
    results,
    loading,
    activeTab,
    setActiveTab,
  };
}
