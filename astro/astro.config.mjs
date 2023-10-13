import { defineConfig } from 'astro/config';
import nodejs from '@astrojs/node';
import react from "@astrojs/react";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: nodejs({
    mode: 'standalone'
  }),
  integrations: [react(), mdx()],
});