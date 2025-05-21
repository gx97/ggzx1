import router from "@/router";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import setting from "./setting";
import { nextTick } from 'vue';

import useUserStore from "@/stores/modules/user";
import pinia from "./stores";
// let userStore = useUserStore(pinia);
// console.log(userStore);


router.beforeEach(async (to: any, from: any, next: any) => {
  let userStore = useUserStore(pinia);

  nprogress.start(); // Start the progress bar

  let token = userStore.token;

  let username = userStore.username;

  if (token) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if (username) {
        next();
      } else {
        try {
          await userStore.getUserInfo()
          next();
        } catch (error) {
          userStore.logout()
          next({ path: "/login", query: { redirect: to.path } });
        }
      }
    }
  } else {
    if (to.path !== "/login") {
      next({ path: "/login", query: { redirect: to.path } });
    } else {
      next();
    }
  }
});

router.afterEach((to: any, from: any) => {
  // You can add any additional logic after navigation here if needed
  // For example, you can log the navigation or perform analytics tracking
  nprogress.done();
  nextTick(() => {
    document.title = `${setting.title} - ${to.meta.title || 'Admin'}`
  });
});


