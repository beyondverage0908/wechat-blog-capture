import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// 引入
import Home from "/@/views/jiucaigongshe/action/index.vue";

// 路由信息
let routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/action-detail",
    name: "action-detail",
    component: () => import("/@/views/jiucaigongshe/action-detail/index.vue"),
  },
];

// 路由器
const router = createRouter({
  history: createWebHistory(), // HTML5模式
  routes,
});

export default router;
