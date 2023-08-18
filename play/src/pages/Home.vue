<template>
  <div>
    <router-link to="/test">测试页面2</router-link>
  </div>
  <img class="img-style" src="@/assets/1689044096720.jpg" alt="" />
  <div v-for="item in [1, 2, 3]" :key="item">
    <div>{{ item }}</div>
  </div>
  <div class="test">{{ testShow }}{{ JSON.stringify(checkMenu) }}</div>
  <!--  <TestJsx />-->
  <HomeTestJsx title="测试jsx" />
</template>
<script setup lang="ts">
import TestJsx from './TestJsx.vue'
import { ref, reactive } from 'vue'
import HomeTestJsx from './HomeTestJsx'

const testShow = ref<string>('这是ts页面，需要展示测试ts情况')

type TCheckMenu = {
  show: boolean
  label: string
  prop: string
  minWidth?: string | number
  width?: string
  align?: string
  render?: any
  summary?: boolean
  sortable?: boolean
  sortOrders?: any
  slot?: any
  onClick?: any
  fixed?: string
  btnList?: any
  overFlowTip?: boolean
  showTabs?: (number | string)[] //展示tab数组
}

const checkMenu = reactive<TCheckMenu[]>([
  {
    prop: 'ticketCode',
    label: '',
    width: '110px',

    show: true,
  },
])
</script>

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
