<template>
  <div class="page-container">
    <GameCanvas />
  </div>
</template>

<script>
import GameCanvas from './components/GameCanvas.vue'

export default {
  components: {
    GameCanvas
  }
}
</script>

<style>
.page-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
