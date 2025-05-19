<template>
    <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
    <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
    <el-button size="small" icon="Setting" circle></el-button>
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
let $router = useRouter();
let $route = useRoute();
let userStore = useUserStore()
let layOutSettingStore = useLayOutSettingStore()



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

</script>

<style scoped></style>