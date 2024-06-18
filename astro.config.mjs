import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import ElementPlus from 'unplugin-element-plus/vite'
import vueJsx from '@vitejs/plugin-vue-jsx';
import node from '@astrojs/node';
// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [
            ElementPlus(),
            vueJsx()
        ],
        server: {
            proxy: {
                '/api': {
                    target: 'http://10.0.0.108/',
                    changeOrigin: true,
                    ws: false
                }
            }
        },
        ssr: {
            noExternal: ['element-plus'],
        },
        resolve: {
            alias: {
                '@': '/src' // 使用 @ 符号指向 src 目录
            }
        }
    },
    integrations: [
        react(),
        vue()
    ],
    output: 'server',
    adapter: node({
        mode: 'standalone' // 或者 'middleware'，根据你的需求选择
    }),
});
