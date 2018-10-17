import Vue from 'vue';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import firebase from 'firebase';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import filters from './filters';

const config = {
  apiKey: 'AIzaSyB-4aj5Nu7VvdyXaXt2B6IV27OMW89FWjg',
  authDomain: 'busterradio-2c254.firebaseapp.com',
  databaseURL: 'https://busterradio-2c254.firebaseio.com',
  projectId: 'busterradio-2c254',
  storageBucket: 'busterradio-2c254.appspot.com',
  messagingSenderId: '348951168415'
};

firebase.initializeApp(config);

// loads the Icon plugin
UIkit.use(Icons);

Vue.config.productionTip = false;

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
