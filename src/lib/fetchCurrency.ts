import { AppEnv } from '@/config/env';

export async function fetchUSDToINR() {
  try {
    const res = await fetch(AppEnv.LATEST_USD_INR_VALUE);
    const json = await res.json();
    if (json && json.rates && json.rates.INR) {
      return json.rates.INR;
    }
  } catch (err) {
    console.error('Failed to fetch USD → INR rate', err);
  }
}
