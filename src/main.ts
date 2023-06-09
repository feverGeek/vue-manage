import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router/tasks';
import { usePermissStore } from './store/permiss';
import 'element-plus/dist/index.css';
import './assets/css/icon.css';
import axios from 'axios';

const app = createApp(App);

axios.defaults.baseURL = 'http://127.0.0.1:5000'
app.config.globalProperties.$axios = axios;
app.use(createPinia());
app.use(router);

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
// 自定义权限指令
const permiss = usePermissStore();
app.directive('permiss', {
    mounted(el, binding) {
        if (!permiss.key.includes(String(binding.value))) {
            el['hidden'] = true;
        }
    },
});

app.mount('#app');
