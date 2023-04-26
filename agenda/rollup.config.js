import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import bundleSize from 'rollup-plugin-bundle-size';
import rimraf from 'rimraf';
import { customAlphabet } from 'nanoid';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import dotenv from 'rollup-plugin-dotenv';
import { summitCfg } from './src/config/summits.js';

const production = !process.env.ROLLUP_WATCH;
const docsAgenda = 'docs'
const buildDirectory = production ? docsAgenda : 'public/build';
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'app',
    file: `${buildDirectory}/bundle.js`
  },
  inlineDynamicImports: true,
  plugins: [
    production && cleanUpDocs(),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production
      }
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // for FullCalendar
    postcss(),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    // importing JSON
    json({
      compact: true // ignores indent and generates the smallest code
    }),
    dynamicImportVars({
      warnOnError: false,
      include: './src/**'
    }),
    dotenv(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
    production &&
      copy({
        targets: [{ src: ['public/*', '!public/build'], dest: docsAgenda }]
      }),
    production && generateIndexHtml(),
    production && bundleSize()
  ],
  watch: {
    clearScreen: false
  }
};

function cleanUpDocs() {
  return {
    buildStart() {
      rimraf.sync(docsAgenda);
    }
  };
}

function generateIndexHtml() {
  const hash = nanoid();
  return {
    generateBundle(output, bundle) {
      bundle['bundle.js'].fileName = `bundle.${hash}.js`;
      bundle['bundle.css'].fileName = `bundle.${hash}.css`;
      summitCfg.forEach(item => {
        this.emitFile({
          type: 'asset',
          fileName: `${item.path}/index.html`,
          source: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />

  <title>${item.title}</title>

  <link rel="icon" type="image/png" href="favicon.ico?" />
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha256-IUOUHAPazai08QFs7W4MbzTlwEWFo7z/4zw8YmxEiko="
    crossorigin="anonymous"
  />
  <link
    href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.2.0/css/all.min.css"
    rel="stylesheet"
  />
  <link rel="stylesheet" href="../global.css" />
  <link rel="stylesheet" href="../bundle.${hash}.css" />

  <script defer src="../bundle.${hash}.js"></script>
</head>

<body></body>
</html>`
        });
      });
    }
  };
}
