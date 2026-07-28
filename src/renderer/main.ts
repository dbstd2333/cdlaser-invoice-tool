import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import App from './App.vue';
import { registerElementPlusIcons } from './icons';
import { router } from './router';
import './styles/global.css';

const app = createApp(App);
registerElementPlusIcons(app);
app.use(createPinia());
app.use(router);
app.use(ElementPlus, { locale: zhCn });
app.mount('#app');
