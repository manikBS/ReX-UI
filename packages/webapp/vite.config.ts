import dns from 'dns';
import { join } from 'path';
import fs from 'fs';

import officeAddin from 'vite-plugin-office-addin'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import tailwind from 'tailwindcss';
import { UserConfig, defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import viteTsConfigPaths from 'vite-tsconfig-paths';

dns.setDefaultResultOrder('verbatim');
const devCerts = require("office-addin-dev-certs");

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const env = loadEnv(mode, process.cwd());

  // expose .env as process.env instead of import.meta since jest does not import meta yet
  const envWithProcessPrefix = Object.entries(env).reduce((prev, [key, val]) => {
    return {
      ...prev,
      ['process.env.' + key]: `"${val}"`,
    };
  }, {});

  return {
    cacheDir: '../../node_modules/.vite/webapp',

    server: {
      https: {
        ca: fs.readFileSync('/home/manikbs/.office-addin-dev-certs/ca.crt'),
        key: fs.readFileSync('/home/manikbs/.office-addin-dev-certs/localhost.key'),
        cert: fs.readFileSync('/home/manikbs/.office-addin-dev-certs/localhost.crt'),
      },
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
          ws: true,
        },
        '/static/graphene_django': {
          target: 'http://localhost:5001',
          changeOrigin: true,
        },
      },
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    define: envWithProcessPrefix,

    css: {
      postcss: {
        plugins: [tailwind({ config: join(__dirname, 'tailwind.config.ts') }), require('autoprefixer')()],
      },
    },

    plugins: [
      legacy(),
      officeAddin({
        devUrl: 'https://localhost:3000',
        prodUrl: 'https://office-addin.contoso.com'
      }),
      react(),
      viteTsConfigPaths({
        projects: ['../../tsconfig.base.json'],
      }),
      svgr({
        svgrOptions: { icon: true },
        include: ['**/*.svg', '**/*.svg?react'],
        exclude: [],
      }),
      viteCommonjs(),
    ],

    build: {
      outDir: 'build',
    },

    resolve: {
      alias: {
        fs: require.resolve('rollup-plugin-node-builtins'),
        path: require.resolve('rollup-plugin-node-builtins'),
      },
    },
  };
});
