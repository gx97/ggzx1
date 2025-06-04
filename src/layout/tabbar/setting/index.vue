<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>

  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <el-form label-position="right" label-width="100px">
      <el-form-item label="主题颜色">
        <el-color-picker v-model="color" show-alpha :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch @change="toggleDark" active-text="开启" inactive-text="关闭" v-model="dark" inline-prompt
          :active-icon="Moon" :inactive-icon="Sunny" />
      </el-form-item>
    </el-form>

    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>

  <img :src="userStore.avatar" style="width: 24px;height: 24px;margin:0px 12px;border-radius: 50%;" />

  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登陆</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/stores/modules/setting'
import useUserStore from '@/stores/modules/user'
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'

let $router = useRouter();
let userStore = useUserStore()
let layOutSettingStore = useLayOutSettingStore()
const dark = ref(false)
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])


const updateRefsh = () => {
  layOutSettingStore.refsh = !layOutSettingStore.refsh
}

const fullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}

const logout = () => {
  userStore.logout()
  $router.push({ path: '/login', query: { redirect: $router.currentRoute.value.fullPath } });
}

const toggleDark = () => {
  let html = document.documentElement;
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
  } else {
    html.classList.add('dark');
  }
}

</script>

<style scoped></style>
