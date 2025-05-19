<template>

    <template v-for="(item, index) in menuList" :key="item.path">

        <template v-if="!item.children">
            <el-menu-item :index="item.path" v-if="!item.meta.hidden">
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>

        <template v-if="item.children && item.children.length === 1">
            <el-menu-item :index="item.children[0].path" v-if="!item.meta.hidden">
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <template #title>

                    <span>{{ item.children[0].meta.title }}</span>
                </template>
            </el-menu-item>
        </template>

        <template v-if="item.children && item.children.length > 1">
            <el-sub-menu :index="item.path" v-if="!item.meta.hidden">
                <template #title>
                    <el-icon>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </template>
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>
        </template>

    </template>

</template>

<script setup lang="ts">
import type { MenuItem } from '@/stores/modules/types/type'
defineProps<{ menuList: MenuItem[] }>()



</script>
<script lang="ts">
export default {
    name: 'Menu',
    props: {
        menuList: {
            type: Array as () => MenuItem[],
            required: true
        }
    }
}
</script>



<style scoped lang="scss">
</style>