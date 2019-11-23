import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';
import Zondicon from 'vue-zondicons';
import VueAnalytics from 'vue-analytics';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import filters from './filters';
import './main.css';

const config = {
  apiKey: 'AIzaSyB-4aj5Nu7VvdyXaXt2B6IV27OMW89FWjg',
  authDomain: 'busterradio-2c254.firebaseapp.com',
  databaseURL: 'https://busterradio-2c254.firebaseio.com',
  projectId: 'busterradio-2c254',
  storageBucket: 'busterradio-2c254.appspot.com',
  messagingSenderId: '348951168415'
};

const isProd = process.env.NODE_ENV === 'production';

firebase.initializeApp(config);

Vue.config.productionTip = false;

Vue.component('Zondicon', Zondicon);
Vue.use(VueAnalytics, {
  id: 'UA-38185444-1',
  router,
  debug: {
    enabled: false, //! isProd,
    sendHitTask: isProd
  }
});

firebase.auth().onAuthStateChanged(() => {
  filters.forEach((f) => {
    Vue.filter(f.name, f.execute);
  });

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
});
