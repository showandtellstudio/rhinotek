import WindiCSS from 'vite-plugin-windicss'
import fs from 'fs'
import path from 'node:path';

export default ({ command }) => ({
  base: command === 'serve' ? '' : '/assets/dist/',
  build: {
    emptyOutDir: true,
    manifest: true,
    outDir: './web/assets/dist/',
    assetsDir: '',
    cssMinify: 'lightningcss',
    rollupOptions: {
      input: {
        app: './src/js/rhinotek.ts'
      },
      output: {
        assetFileNames: ({name}) => {
          if (/\.(webp|jpe?g|png|svg)$/.test(name ?? '')){
            return 'images/[name]-[hash][extname]';
          } else if (/\.(otf|woff|woff2)$/.test(name ?? '')){
            return 'fonts/[name]-[hash][extname]';
          } else if (/\.css$/.test(name ?? '')) {
            return 'css/[name]-[hash][extname]';
          }
          return '[name]-[hash][extname]';
        }
      }
    }
  },
  esbuild: { 
    legalComments: 'none' 
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [
    WindiCSS({
      config: 'windi.config.js'
    })
  ],
  server: {
    fs: {
      strict: false
    },
    origin: 'https://localhost:3000',
    port: 3000,
    strictPort: true,
    https: {
      key: fs.readFileSync('src/_certificate/localhost-key.pem'),
      cert: fs.readFileSync('src/_certificate/localhost.pem'),
    },
    hmr: {
      host: 'localhost',
    }
  },
});
