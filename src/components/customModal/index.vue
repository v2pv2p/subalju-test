<template>
  <div class="customModal">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'customModal'
}
</script>

<style scoped>
.customModal {
  display: flex;
  position: absolute;
  /* // FIXME: If there is a scrollbar, the screen exceeds the scrollbar area */
  min-height: 100vh;
  width: 100%;
  z-index: 900;
}
</style>
