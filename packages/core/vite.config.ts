import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
// import DefineOptions from 'unplugin-vue-define-options/vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true
      }
    }),
    // DefineOptions(),
    vueJsx(),
    cssInjectedByJsPlugin(),
    dts({
      // skipDiagnostics: true, // 是否跳过类型诊断
      copyDtsFiles: true,
      // 是否将动态引入转换为静态
      staticImport: true,
      // 可以指定一个数组来输出到多个目录中
      outDir: [
        resolve(__dirname, '../secure-action/lib'),
        resolve(__dirname, '../secure-action/es')
      ],
      entryRoot: resolve(__dirname, './src'),
      insertTypesEntry: true
    })
  ],
  build: {
    target: 'modules',
    minify: false,
    chunkSizeWarningLimit: 2,
    reportCompressedSize: true,
    emptyOutDir: true,
    // 指定输出路径
    outDir: resolve(__dirname, '../secure-action'),
    lib: {
      name: 'SecureAction',
      entry: resolve(__dirname, './index.ts')
    },
    rollupOptions: {
      external: ['vue'],
      output: [
        {
          // 打包模式 https://rollupjs.org/guide/en/#outputformat
          format: 'es',
          // 导出模式 https://rollupjs.org/guide/en/#outputexports
          exports: 'named',
          entryFileNames: '[name].mjs',
          // 输出路径 https://rollupjs.org/guide/en/#outputdir
          dir: '../secure-action/es',
          sourcemap: false,
          // https://rollupjs.org/guide/en/#outputpreservemodules
          preserveModules: true,
          preserveModulesRoot: resolve(__dirname, './src'),
          globals: {
            vue: 'Vue'
          }
        },
        {
          format: 'cjs',
          exports: 'named',
          entryFileNames: '[name].js',
          dir: '../secure-action/lib',
          sourcemap: false,
          preserveModules: true,
          preserveModulesRoot: resolve(__dirname, './src'),
          globals: {
            vue: 'Vue'
          }
        }
      ]
    }
  }
})
