import { useState, useEffect, useCallback, useRef } from 'react';
import { calculate, type CalculatorResults } from '../lib/api';
import { DEFAULT_INPUTS, type CalculatorInputs } from '../lib/defaults';

interface UseCalculatorReturn {
  inputs: CalculatorInputs;
  setInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  results: CalculatorResults | null;
  loading: boolean;
  error: string | null;
}

export function useCalculator(): UseCalculatorReturn {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runCalculation = useCallback(async (currentInputs: CalculatorInputs) => {
    try {
      setLoading(true);
      setError(null);
      const data = await calculate(currentInputs);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial calculation
  useEffect(() => {
    runCalculation(inputs);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced calculation on input change
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      runCalculation(inputs);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputs, runCalculation]);

  const setInput = useCallback(<K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  return { inputs, setInput, results, loading, error };
}
