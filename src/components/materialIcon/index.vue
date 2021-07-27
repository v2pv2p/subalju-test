<template>
  <span class="material-icons notranslate">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'materialIcon'
}
</script>

<style scoped>
.material-icons {
  user-select: none;
}
</style>
