<template>
    <el-icon style="margin-right: 10px;" @click="changeIcon">
        <component :is=" layOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <el-breadcrumb separator=">">
        <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
            <el-icon>
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span style="margin: 0px 5px;">{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/stores/modules/setting'
import { useRoute } from 'vue-router'

let $route = useRoute()
let layOutSettingStore = useLayOutSettingStore()

const changeIcon = () => {
    layOutSettingStore.fold = !layOutSettingStore.fold
}

</script>

<style scoped></style>