import 'bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import App from './App.vue'
import router from './router'

import { jwtRefresh } from './helpers/jwtRefresh';

import { store } from './store';

const app = createApp(App);

// jwtRefresh();

app.use(router);

app.use(store);

app.use(Toast, {timeout : 2000});

app.mount("#app");


import 'bootstrap/dist/js/bootstrap.js'