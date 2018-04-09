<template>
  <div id="app">
    <router-view></router-view>
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

<style lang="sass">
@import '~bulma';
@import "~buefy/src/scss/buefy";
@import '~bulma-divider';
</style>

