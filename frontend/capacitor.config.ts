import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goldtrader.simulator',
  appName: 'GoldTrader',
  webDir: 'out',
  server: {},
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0d1117',
    preferredContentMode: 'desktop',
  },
};

export default config;
