import Vue from 'vue';
import firebase from 'firebase';
import Zondicon from 'vue-zondicons';
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

firebase.initializeApp(config);

Vue.config.productionTip = false;

Vue.component('Zondicon', Zondicon);

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
