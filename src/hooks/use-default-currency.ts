import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "settings.defaultCurrency";
const FALLBACK_CURRENCY = "EGP";

export function useDefaultCurrency() {
  const [defaultCurrency, setDefaultCurrencyState] =
    useState(FALLBACK_CURRENCY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCurrency = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (isMounted && stored) {
          setDefaultCurrencyState(stored);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCurrency();

    return () => {
      isMounted = false;
    };
  }, []);

  const setDefaultCurrency = useCallback(async (value: string) => {
    setDefaultCurrencyState(value);
    await AsyncStorage.setItem(STORAGE_KEY, value);
  }, []);

  return { defaultCurrency, setDefaultCurrency, isLoading };
}
