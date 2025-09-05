import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
  // ...existing config
  plugins: [
    typography,
    // ...other plugins
  ],
} satisfies Config;
