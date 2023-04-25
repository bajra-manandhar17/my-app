import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import del from 'rollup-plugin-delete';
import image from '@rollup/plugin-image';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-node-externals';

const dtsOps = {
  compilerOptions: {
    paths: {
      '@components/*': ['src/components/*'],
    },
  },
};

const bundlePlugins = [
  commonjs({
    include: 'node_modules/**',
  }),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      [
        'module-resolver',
        {
          root: ['./src/'],
          alias: {
            '@components': './src/components',
          },
        },
      ],
    ],
    extensions: ['tsx', 'ts'],
  }),
];

const bundleIcons = (config) => ({
  ...config,
  input: 'src/icons/index.ts',
  plugins: [...config.plugins],
  treeShake: true,
});

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
  plugins: [externals(), ...bundlePlugins, ...config.plugins],
  treeShake: true,
});

const esbuildPlugin = esbuild();
const imagePlugin = image();

export default [
  bundle({
    plugins: [
      del({
        targets: 'lib/**',
      }),
      esbuildPlugin,
      imagePlugin,
    ],
    output: [
      {
        format: 'cjs',
        dir: 'lib',
        sourcemap: true,
        preserveModules: true,
        exports: 'auto',
      },
    ],
  }),
  bundle({
    plugins: [dts(dtsOps)],
    output: [
      {
        format: 'cjs',
        dir: 'lib',
        preserveModules: true,
        exports: 'auto',
      },
    ],
  }),
  bundleIcons({
    plugins: [dts(dtsOps)],
    output: [
      {
        format: 'cjs',
        dir: 'lib/icons',
        preserveModules: true,
        exports: 'auto',
      },
    ],
  }),
];