import { createRouter, createWebHistory } from "vue-router";

// 引入
import Home from "/@/views/jiucaigongshe/action/index.vue";

// 路由信息
let routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
];

// 路由器
const router = createRouter({
  history: createWebHistory(), // HTML5模式
  routes,
});

export default router;
