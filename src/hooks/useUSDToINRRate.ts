import { AppEnv } from '@/config/env';
import { fetchUSDToINR } from '@/lib/fetchCurrency';
import { useEffect, useState } from 'react';

const useUSDToINRRate = () => {
  const [rate, setRate] = useState(80);

  useEffect(() => {
    async function load() {
      const value = await fetchUSDToINR();
      setRate(value);
    }
    load();
  }, []);

  return rate;
};

export default useUSDToINRRate;
