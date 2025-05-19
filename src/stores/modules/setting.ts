import { defineStore } from 'pinia'

let useLayOutSettingStore = defineStore('LayOutSetting', {
    state: () => {
        return {
            fold: false,//顶部菜单折叠
            refsh: false,//顶部刷新
        }
    }
})

export default useLayOutSettingStore;