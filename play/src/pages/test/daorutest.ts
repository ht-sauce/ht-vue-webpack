export const test = 1
export function Forin() {
  const a = {
    a: 1,
    2: 2,
  }
  for (let key in a) {
    console.log(key)
  }
}
