<template>
    <a @click="isOverlayDisplay = !isOverlayDisplay">
      <img :src="`https://raw.githubusercontent.com/zikumanage/jaico_gallery/main/assets/images/backnumber/${year}_0${length}.jpg`">
      <Transition name="overlay">
        <div class="gallery__overlay" v-show="isOverlayDisplay">
          <img class="gallery__overlayImage slide-in" :src="`https://raw.githubusercontent.com/zikumanage/jaico_gallery/main/assets/images/backnumber/${year}_0${length}.jpg`">
        </div>
      </Transition>
    </a>
  </template>

<script setup lang="ts">

const props = defineProps({
  length: Number,
  year: Number
})

// const generateImgPath = (fileYear: number,fileName: number): string => {
//   return new URL(`/assets/images/backnumber/${fileYear}_0${fileName}.jpg`, import.meta.url).href
// }

const isOverlayDisplay = ref(false)

</script>