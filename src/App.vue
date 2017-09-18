<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import store from './store'

export default {
  name: 'app',
  store
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  width: 100vw;
  height: 100vh;
}
</style>
