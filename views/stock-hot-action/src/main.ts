import { createApp } from "vue";
import router from "./router/index";
import App from "./App.vue";
import "/@/naive";
import "/@/scss/reset.css";
import "virtual:windi.css";

createApp(App).use(router).mount("#app");
