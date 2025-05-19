// src/stores/modules/user.ts
import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo,reqLogout } from '@/api/user'
import type { loginForm, loginResponseData, userInfoResponseData } from '@/api/user/type'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { constantRoute } from '@/router/routes'

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
                return 'ok'
            } else {
                return Promise.reject(new Error(result.data || 'fail'))
            }
        },
        async getUserInfo() {
            let result:userInfoResponseData = await reqUserInfo();
            if (result.code === 200) {
                this.username = result.data.username
                this.avatar = result.data.avatar
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