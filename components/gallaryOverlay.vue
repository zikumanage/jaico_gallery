<template>
  <SwiperSlide>
        <div class="gallery__overlay">
          <img class="gallery__overlayImage slide-in" :src="image.default">
        </div>
  </SwiperSlide>
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

</script>