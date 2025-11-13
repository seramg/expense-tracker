import { AppEnv } from '@/config/env';
import { useEffect, useState } from 'react';

const useUSDToINRRate = () => {
  const [rate, setRate] = useState(80);

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(AppEnv.LATEST_USD_INR_VALUE);
        const json = await res.json();
        if (json && json.rates && json.rates.INR) {
          setRate(json.rates.INR);
        }
      } catch (err) {
        console.error('Failed to fetch USD → INR rate', err);
      }
    }

    fetchRate();
  }, []);

  return rate;
};

export default useUSDToINRRate;
