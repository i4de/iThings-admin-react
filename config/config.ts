import { join } from 'path';
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV } = process.env;

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

export default defineConfig({
  hash: true,
  antd: {},
  publicPath: '/',
  dva: {
    immer: true,
    hmr: true,
    lazyLoad: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import  request  from '@/utils/request'",
      schemaPath: join(__dirname, 'iThingsapi.json'),
      mock: false,
      projectName: 'iThingsapi',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  chainWebpack: (config: any, { env }) => {
    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        languages: [
          'abap',
          'apex',
          'azcli',
          'bat',
          'bicep',
          'cameligo',
          'clojure',
          'coffee',
          'cpp',
          'csharp',
          'csp',
          'css',
          'dart',
          'dockerfile',
          'ecl',
          'elixir',
          'flow9',
          'fsharp',
          'go',
          'graphql',
          'handlebars',
          'hcl',
          'html',
          'ini',
          'java',
          'javascript',
          'json',
          'julia',
          'kotlin',
          'less',
          'lexon',
          'liquid',
          'lua',
          'm3',
          'markdown',
          'mips',
          'msdax',
          'mysql',
          'objective-c',
          'pascal',
          'pascaligo',
          'perl',
          'pgsql',
          'php',
          'pla',
          'postiats',
          'powerquery',
          'powershell',
          'protobuf',
          'pug',
          'python',
          'qsharp',
          'r',
          'razor',
          'redis',
          'redshift',
          'restructuredtext',
          'ruby',
          'rust',
          'sb',
          'scala',
          'scheme',
          'scss',
          'shell',
          'solidity',
          'sophia',
          'sparql',
          'sql',
          'st',
          'swift',
          'systemverilog',
          'tcl',
          'twig',
          'typescript',
          'vb',
          'xml',
          'yaml',
        ],
      },
    ]);
  },
});
