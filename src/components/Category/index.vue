<template>
    <el-card>
        <el-form :inline="true" :disabled="scene === 1">

            <el-form-item label="一级分类">
                <el-select  v-model="categoryStore.c1Id" @change="handler" style="width: 240px;">
                    <el-option v-for="item in categoryStore.c1List" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="二级分类">
                <el-select  v-model="categoryStore.c2Id" @change="handler1" style="width: 240px;">
                    <el-option v-for="(item, index) in categoryStore.c2List" :key="item.id" :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="三级分类">
                <el-select v-model="categoryStore.c3Id" @change="handler2" style="width: 240px;">
                    <el-option v-for="(item, index) in categoryStore.c3List" :key="item.id" :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

        </el-form>

    </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useCategoryStore from '@/stores/modules/category'

defineProps({
    scene: {
        type: Number,
    }
})

let categoryStore = useCategoryStore();


onMounted(() => {
    getC1();
});

const getC1 = () => {
    categoryStore.getC1List();
}
const handler = () => {
    categoryStore.c3Id = '';
    categoryStore.c2Id = '';
    categoryStore.c3List = [];
    categoryStore.getC2List();
}
const handler1 = () => {
    categoryStore.c3Id = '';
    categoryStore.getC3List();
}
const handler2 = () => {
    // categoryStore.getC3List();
}

</script>

<style scoped></style>