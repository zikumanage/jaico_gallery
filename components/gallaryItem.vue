<template>
    <a @click="isOverlayDisplay = !isOverlayDisplay">
      <img :src="image.default">
      <Transition name="overlay">
        <div class="gallery__overlay" v-show="isOverlayDisplay">
          <img class="gallery__overlayImage slide-in" :src="image.default">
        </div>
      </Transition>
    </a>
  </template>

<script setup lang="ts">

const props = defineProps({
  length: Number,
  year: Number
})

let image = {
  default:''
}

try {
  image = await import(`~/assets/images/backnumber/${props.year}_0${props.length}.jpg`)
} catch (e) {
  console.log(e)
}

// const generateImgPath = (year: number,length: number): string => {
//   return new URL(`~/assets/images/backnumber/${year}_0${length}.jpg`, import.meta.url).href
// }

const isOverlayDisplay = ref(false)

</script>