function vueEsm(isVue2 = false, runtimeCompiler = false) {
  if (isVue2) {
    return runtimeCompiler ? 'vue/dist/vue.esm.js' : 'vue/dist/vue.runtime.esm.js'
  } else {
    return runtimeCompiler ? 'vue/dist/vue.esm-bundler.js' : 'vue/dist/vue.runtime.esm-bundler.js'
  }
}
module.exports = {
  vueEsm,
}
