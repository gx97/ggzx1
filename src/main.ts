import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import 'virtual:svg-icons-register'
import gloalComponent from '@/components'
import '@/styles/index.scss'
import router from './router'
import pinia from './stores'
import './permission'

const app = createApp(App)
// app.use(ElementPlus)
app.use(ElementPlus, {
    locale: zhCn,
  })
app.use(gloalComponent)
app.use(router)
app.use(pinia)
app.mount('#app')
