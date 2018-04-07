import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: require('@/components/Login').default,
    },
    {
      path: '*',
      redirect: '/login',
    },
  ],
});
