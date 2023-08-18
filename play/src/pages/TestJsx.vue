<template lang="tsx">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    return () => (
      <div class="test">
        <div>test jsx</div>
      </div>
    )
  },
})
</template>

<style scoped lang="scss">
.test {
  background: burlywood;
  width: 333px;
  height: 100px;
}
</style>
