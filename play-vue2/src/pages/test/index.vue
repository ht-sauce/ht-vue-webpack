<template>
  <div>
    <router-link to="/">首页</router-link>
  </div>
  <img class="img-style" src="@/assets/1689044096720.jpg" alt="" />
</template>
<script setup lang="ts">
import { Forin } from './daorutest'

Forin()
</script>

<style scoped lang="scss">
.img-style {
  width: 200px;
  height: 200px;
}
</style>
