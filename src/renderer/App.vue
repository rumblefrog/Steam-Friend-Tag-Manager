<template>
  <div id="app">
    <section class="hero is-black is-fullheight">
      <div class="hero-head">
        <header class="navbar">
          <div class="container">
            <div class="navbar-brand">
              <a class="navbar-item">
                <b-icon icon="tags"></b-icon>
              </a>
              <span class="navbar-burger burger" @click="navMenuActive = !navMenuActive">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div class="navbar-menu" :class="{'is-active': navMenuActive}">
              <div class="navbar-end">
              </div>
            </div>
          </div>
        </header>
      </div>

      <div class="hero-body pattern-bg">
        <div class="container">
          <router-view></router-view>
        </div>
      </div>

    </section>
  </div>
</template>

<script>
export default {
  name: "Steam-Friend-Tag-Manager",
  data() {
    return {
      navMenuActive: false
    };
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  },
};
</script>

<style>
/* CSS */
</style>
