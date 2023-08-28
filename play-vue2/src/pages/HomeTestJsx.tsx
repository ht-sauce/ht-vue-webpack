import { defineComponent } from 'vue'

type props = {
  title: string
}
const HomeTestJsx = (content: any) => {
  const { props } = content
  return <div style="background: pink;height: 500px;">{props.title}</div>
}

HomeTestJsx.props = ['title']

export default HomeTestJsx
