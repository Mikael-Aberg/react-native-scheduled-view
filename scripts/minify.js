#!/usr/bin/env node

const { minify } = require('terser');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function minifyFiles(pattern) {
  const files = glob.sync(pattern);

  for (const file of files) {
    try {
      const code = fs.readFileSync(file, 'utf8');
      const result = await minify(code, {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: [], // Don't remove any function calls
        },
        mangle: {
          reserved: ['exports', 'require', 'module'], // Keep these names
        },
        output: {
          comments: false, // Remove comments
        },
        sourceMap: {
          filename: path.basename(file),
          url: path.basename(file) + '.map',
        },
      });

      if (result.error) {
        console.error(`Error minifying ${file}:`, result.error);
        continue;
      }

      // Write minified file
      fs.writeFileSync(file, result.code);

      // Write source map
      if (result.map) {
        fs.writeFileSync(file + '.map', result.map);
      }

      console.log(`✓ Minified ${file}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
}

async function main() {
  console.log('Starting Terser minification...');

  // Minify CommonJS files
  await minifyFiles('lib/commonjs/*.js');

  // Minify ES module files
  await minifyFiles('lib/module/*.js');

  console.log('Minification complete!');
}

main().catch(console.error);
