<template>

    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider" :class="{ fold: layOutSettingStore.fold }">
            <Logo></Logo>

            <el-scrollbar class="scrollbar">
                <el-menu :collapse="layOutSettingStore.fold" class="el_menu" background-color="$base-menu-background" text-color="white" :router=true
                    :default-active="$route.path">
                    <Menu :menuList="menuList"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>

        <!-- 顶部导航 -->
        <div class="layout_header" :class="{ fold: layOutSettingStore.fold }">
            <Tabbar></Tabbar>
        </div>

        <!-- 右侧内容区域 -->
        <div class="layout_main" :class="{ fold: layOutSettingStore.fold }">
            <Main></Main>
        </div>
    </div>

</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Tabbar from './tabbar/index.vue'
import useUserStore from '@/stores/modules/user'
import Main from './main/index.vue'
import useLayOutSettingStore from '@/stores/modules/setting'

let layOutSettingStore = useLayOutSettingStore()

let $route = useRoute()

let menuList = useUserStore().menuRoutes
</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        background: $base-menu-background;
        transition: all 0.3s;

        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-menu-logo-height);

            .el_menu {
                border-right: none;
            }
        }

        &.fold {
            width: $base-menu-min-width;
        }
    }

    .layout_header {
        position: fixed;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        top: 0px;
        left: $base-menu-width;
        transition: all 0.3s;
        &.fold {
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        left: $base-menu-width;
        top: $base-tabbar-height;
        padding: 20px;
        overflow: auto;
        transition: all 0.3s;
        &.fold {
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }
}
</style>