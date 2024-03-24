<template>
  <div class="scroll_container">
      <div class="sticky_wrap">
        <div class="horizontal_scroll">
          <div class="scroll_contents red">
            <h2 class="left">Hello</h2>
          </div>
          <div class="scroll_contents yellow"></div>
          <div class="scroll_contents green"></div>
          <div class="scroll_contents blue">
            <h2 class="right">Goodbye</h2>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">

const transform = (section) => {
  const offsetTop = section.parentElement.offsetTop;

  const scrollSection = section.querySelector('.horizontal_scroll')

  let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;

  percentage = percentage < 0 ? 0 : percentage > 300 ? 300 : percentage;

  scrollSection.style.transform = `translate3d(${-(percentage)}vw, 0, 0)`
};

onMounted(() => {
  const stickySections = [...document.querySelectorAll('.sticky_wrap')]
  
  window.addEventListener('scroll', (e) => {
    for(let i = 0; i < stickySections.length; i++){
      transform(stickySections[i])
    }
  })
})

</script>

<style lang="scss">

.scroll_container {
  height: 400vh;
}

.horizontal_scroll {
  position: absolute;
  top: 0;
  height: 100%;
  width: 400vw;
  will-change: transform;
  display: flex;
  justify-content: space-between;
}

.scroll_contents {
  height: 100%;
  width: 100vw;
}

.sticky_wrap {
  overflow: hidden;
  position: sticky;
  top: 0;
  height: 100vh;
}

.red {
  background-color: #ff3d00;
}

.yellow {
  background-color: #ffff00;
}

.green {
  background-color: #05ff00;
}

.blue {
  background-color: #2835f8;
}

h2 {
  font-size: 2rem;
  color: #f7f7f7;
}

.left {
  margin-top: 5vh;
  margin-left: 5vw;
}

.right {
  text-align: right;
  margin-top: 85vh;
  margin-right: 5vw;
}
</style>
