// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/css/_variables.scss";',
        },
      },
    },
  },
  css: ["@/assets/css/main.scss"],
  app:{
    head: {
    title: 'JAICO',
    htmlAttrs: {
      lang : 'ja'
    },
    script: [
      { src: 'https://platform.twitter.com/widgets.js' }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'JAICO' },
      { hid: 'og:image', property: 'og:image', content: 'https://' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&family=M+PLUS+Rounded+1c:wght@500;800&family=Noto+Sans+JP:wght@400;700&display=swap' }
    ]
  },
  }
})
