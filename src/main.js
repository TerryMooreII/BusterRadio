import Vue from 'vue';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import filters from './filters';


// loads the Icon plugin
UIkit.use(Icons);

Vue.config.productionTip = false;


filters.forEach((f) => {
  Vue.filter(f.name, f.execute);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
