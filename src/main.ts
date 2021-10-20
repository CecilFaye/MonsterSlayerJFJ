import { createApp } from 'vue';
import App from './App.vue';
// import * as userService from './services/service-container';
// import serviceContainer  from './services/service-container';
import * as MonsterSlayerService from './services/monster-slayer.factory';
import store from './store';

const app = createApp(App);
app.provide('service', MonsterSlayerService)
app.use(store);
app.mount('#app');

