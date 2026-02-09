import { useState, useEffect, useCallback, useRef } from 'react';
import { calculate, type CalculatorResults } from '../lib/api';
import { DEFAULT_INPUTS, type CalculatorInputs } from '../lib/defaults';
import { parseUrlInputs, useUrlState } from './useUrlState';
import type { CityPreset } from '../data/cities';

interface UseCalculatorReturn {
  inputs: CalculatorInputs;
  setInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  setInputs: (inputs: CalculatorInputs) => void;
  results: CalculatorResults | null;
  loading: boolean;
  error: string | null;
  copyUrl: () => Promise<boolean>;
  handleCitySelect: (city: CityPreset) => void;
  selectedCity: string | null;
}

export function useCalculator(initialCity?: CityPreset): UseCalculatorReturn {
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    const urlInputs = parseUrlInputs();
    // City defaults override base defaults, URL params override city
    const cityDefaults = initialCity ? {
      monthly_rent: initialCity.monthly_rent,
      purchase_price: initialCity.purchase_price,
      property_tax_rate: initialCity.property_tax_rate,
      home_insurance_rate: initialCity.home_insurance_rate,
      hoa_monthly: initialCity.hoa_monthly,
      state_tax_rate: initialCity.state_tax_rate,
    } : {};
    return { ...DEFAULT_INPUTS, ...cityDefaults, ...urlInputs };
  });
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(initialCity?.slug ?? null);
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

  // City selection handler
  const handleCitySelect = useCallback((city: CityPreset) => {
    setSelectedCity(city.slug);
    setInputs(prev => ({
      ...prev,
      monthly_rent: city.monthly_rent,
      purchase_price: city.purchase_price,
      property_tax_rate: city.property_tax_rate,
      home_insurance_rate: city.home_insurance_rate,
      hoa_monthly: city.hoa_monthly,
      state_tax_rate: city.state_tax_rate,
    }));
  }, []);

  // URL state sync
  const { copyUrl } = useUrlState(inputs, setInputs);

  return { inputs, setInput, setInputs, results, loading, error, copyUrl, handleCitySelect, selectedCity };
}
