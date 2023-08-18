<script setup lang="ts"></script>

<template>
  <div>
    <router-link to="/test">测试页面2</router-link>
  </div>
  <img class="img-style" src="@/assets/1689044096720.jpg" alt="" />
  <div v-for="item in [1, 2, 3]" :key="item">
    <div>{{ item }}</div>
  </div>
  <div class="test"></div>
</template>

<style scoped lang="scss">
@import '@/assets/config.scss';
@import '@/assets/test-in.scss';
.img-style {
  margin-left: 20%;
  width: 100px;
  height: $test;
}
//.bed-type {
//  margin-right: 16px;
//}
#{PrefixClass('form-item')} {
  margin-bottom: 16px;
  margin-right: 10px;
  #{PrefixClass('form-item')} {
    margin-bottom: 0;
  }
}
</style>
