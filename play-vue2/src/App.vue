<template>
  <RouterView />
</template>
<script lang="ts" setup>
console.log(process.env.VUE_APP_BASE_API, 122)
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100vh;
  background: blanchedalmond;
}
</style>
