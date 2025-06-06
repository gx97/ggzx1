// src/stores/modules/user.ts
import { reqLogin, reqUserInfo } from '@/api/user'
import type { loginForm, loginResponseData, userInfoResponseData } from '@/api/user/type'
import { anyRoute, asyncRoute, constantRoute } from '@/router/routes'
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token'
import { defineStore } from 'pinia'
import type { UserState } from './types/type'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

//  过滤权限路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 使用具名导出（named export）
let useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
    }
  },
  getters: {},
  actions: {
    async userLogin(data: loginForm) {
      let result: loginResponseData = await reqLogin(data)
      if (result.code === 200) {
        this.token = (result.data as string)
        SET_TOKEN(result.data as string)
        // 👇 获取用户信息并动态添加路由
        await this.getUserInfo()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data || 'fail'))
      }
    },
    async getUserInfo() {
      let result: userInfoResponseData = await reqUserInfo();
      if (result.code === 200) {
        this.username = result.data.username
        this.avatar = result.data.avatar
        //计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)

        // 构建完整的菜单路由
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute]

        // 添加路由
        userAsyncRoute.forEach((route: any) => {
          router.addRoute(route)
        })

        // 添加 anyRoute 兜底路由
        anyRoute.forEach((route: any) => {
          router.addRoute(route)
        })

        // 强制刷新当前路由以匹配新添加的路径
        await router.replace(router.currentRoute.value.fullPath)
        return 'ok'
      } else {
        return Promise.reject('获取用户信息失败')
      }
    },
    async logout() {
      this.token = ''
      this.username = ''
      this.avatar = ''
      REMOVE_TOKEN()
    }

  }
})

export default useUserStore;
