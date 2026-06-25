import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goldtrader.simulator',
  appName: 'GoldTrader',
  webDir: 'out',
  server: {
    // En desarrollo apunta al servidor local; en producción usa el bundle estático
    // Descomenta para dev: url: 'http://localhost:3000', cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0d1117',
    preferredContentMode: 'desktop',
  },
};

export default config;
