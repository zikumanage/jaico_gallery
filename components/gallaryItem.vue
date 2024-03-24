<template>
    <a @click="isOverlayDisplay = !isOverlayDisplay">
      <img :src="generateImgPath(length)">
      <div class="gallery__overlay" v-show="isOverlayDisplay">
        <img class="gallery__overlayImage" :src="generateImgPath(length)">
      </div>
    </a>
  </template>

<script setup lang="ts">

const props = defineProps({
  length: Number
})

const generateImgPath = (fileName: number): string => {
  return new URL(`../assets/images/backnumber/2024_0${fileName}.jpg`, import.meta.url).href
}

const isOverlayDisplay = ref(false)

</script>