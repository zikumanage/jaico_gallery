<template>
    <a @click="isOverlayDisplay = !isOverlayDisplay">
      <img :src="generateImgPath(year,length)">
      <Transition name="fade">
        <div class="gallery__overlay" v-show="isOverlayDisplay">
          <img class="gallery__overlayImage" :src="generateImgPath(year,length)">
        </div>
      </Transition>
    </a>
  </template>

<script setup lang="ts">

const props = defineProps({
  length: Number,
  year: Number
})

const generateImgPath = (fileYear: number,fileName: number): string => {
  return new URL(`~/assets/images/backnumber/${fileYear}_0${fileName}.jpg`, import.meta.url).href
}

const isOverlayDisplay = ref(false)

</script>