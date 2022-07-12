import { createApp } from "vue";
import router from "./router/index";
import App from "./App.vue";
import "/@/naive";
import "/@/scss/reset.css";

createApp(App).use(router).mount("#app");
