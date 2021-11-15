import { createApp } from 'vue';

import App from './App.vue';
import { registerComponents } from './globalRegister';
import router from './router';
import store from './store';

const app = createApp(App);

registerComponents(app);

app.use(store);
app.use(router);
app.mount('#app');

