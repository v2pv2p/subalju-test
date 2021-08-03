<template>
  <div id="app">
    <div class="router">
      <router-view/>
    </div>
    <div class="popup">
      <popup-anchor/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
#app {
  height: 100vh;
  overflow-y: hidden;

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  .router {
    width: 100%;
    min-height: 100%;
    overflow: hidden;
  }

  .popup {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

}
</style>
