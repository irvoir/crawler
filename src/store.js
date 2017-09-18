import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    url: null,
    links: 'NaN',
    scripts: 'NaN',
    images: 'NaN',
    seconds: 'NaN',
    err: `Invalid input, please edit.`,
    guide: `Insert http:// or https://`,
    dep: null
  },
/*eslint-disable */
  mutations: {
    url (state, n) {
      let res = n
      let nu = state.dep
      // to add state methods only accepts numbers otherwise return NaN
      if (nu == 0) {
        state.guide = `Processed!`
        state.links = res[0]
        state.scripts = res[1]
        state.images = res[2]
        state.seconds = res[3] + 's'
      } else {
        let tog
        let teTim = res[4][0]
        res = res.filter(item => item !== teTim)
        tog = [].concat(...res)
        state.links = tog[0] + tog[4] + tog[8] + tog[12]
        state.scripts = tog[1] + tog[5] + tog[9] + tog[13]
        state.images = tog[2] + tog[6] + tog[10] + tog[14]
        state.seconds = (tog[3] + tog[7] + tog[11] + tog[15] + teTim).toFixed(3) + 's'
      }
    },
    update (state, n) {
      state.seconds = 0
    },
    input (state, n) {
      state.guide = n
    },
    depth (state, n) {
      state.dep = n
    }
  }
})
/*eslint-enable */
export default store
