<script lang="tsx">
import { ref, reactive } from 'vue'
import { defineComponent } from 'vue'
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
export default defineComponent({
  setup() {
    const tableData = ref<any[]>([])
    const checkMenu = reactive<TCheckMenu[]>([
      {
        prop: 'ticketCode',
        label: '',
        width: '110px',

        show: true,
      },
    ])

    return () => <div>这是jsx页面，需要展示测试jsx情况</div>
  },
})
</script>

<style scoped lang="scss">
.test {
  background: burlywood;
  width: 333px;
  height: 100px;
}
</style>
