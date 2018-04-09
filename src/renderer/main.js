import Vue from 'vue';
import Buefy from 'buefy';

import fontawesome from "@fortawesome/fontawesome";
import solid from "@fortawesome/fontawesome-free-solid";
// import regular from "@fortawesome/fontawesome-free-regular";
// import brands from "@fortawesome/fontawesome-free-brands";

import App from './App';
import router from './router';
import store from './store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

Vue.use(Buefy, {
  defaultIconPack: 'fas',
});

fontawesome.library.add(
  solid.faTags
);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
