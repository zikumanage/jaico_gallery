// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-swiper'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/_variables.scss";',
        },
      },
    },
  },
  css: ["@/assets/css/main.scss"],
  app:{
    // baseURL: '/jaico_gallery/',
    buildAssetsDir: 'output',
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
      { hid: 'description', name: 'description', content: 'JAICO || JAICO FES' },
      { hid: 'keywords', name: 'keywords', content: 'JAICO,JAICO FES,JAPAN IDOL CONNECT,jaico,J A I C O' },
      { hid: 'og:image', property: 'og:image', content: 'https://raw.githubusercontent.com/zikumanage/jaico_gallery/main/assets/images/logo_b.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&family=M+PLUS+Rounded+1c:wght@500;800&family=Noto+Sans+JP:wght@400;700&display=swap' }
    ]
  },
  },
  swiper: {
    // Swiper options
    //----------------------
    // prefix: 'Swiper',
    // styleLang: 'css',
    // modules: ['navigation', 'pagination'], // all modules are imported by default
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('swiper-'),
    },
  },
})
