type props = {
  title: string
}
const HomeTestJsx = (props: props) => {
  return <div style="background: pink;height: 500px;">{props.title}</div>
}

HomeTestJsx.props = ['title']

export default HomeTestJsx
