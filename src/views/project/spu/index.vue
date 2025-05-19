<template>
    <div>
        <Category :scene="scene"></Category>
        <el-card style="margin: 10px 0px;">
            <div v-show="scene === 0">

                <el-button type="primary" icon="Plus" @click="addSpu"
                    :disabled="categoryStore.c3Id ? false : true">添加SPU</el-button>
                <el-table style="margin: 10px 0px;" border :data="records">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                    <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
                    <el-table-column label="SPU操作">
                        <template #default="scope">
                            <el-button type="primary" icon="Plus" title="添加SKU"></el-button>
                            <el-button type="primary" icon="Edit" title="修改SPU"
                                @click="updateSpu(scope.row)"></el-button>
                            <el-button type="primary" icon="Search" title="查看SKU列表"></el-button>
                            <el-button type="danger" icon="Delete" title="删除SPU"></el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                    :background="true" layout="prev, pager, next, jumper,->, sizes,total " :total="totalNum"
                    @change="getSpuList(pageNo)" />

            </div>

            <SpuForm ref="spu" v-show="scene === 1" @changeScene="changeScene"></SpuForm>

            <SkuForm v-show="scene === 2"></SkuForm>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import useCategoryStore from '@/stores/modules/category';
import { reqSpuData } from '@/api/project/spu';
import SpuForm from './spuForm.vue';
import SkuForm from './skuForm.vue';
import type { SpuResponseData, Records } from '@/api/project/spu/type';
import type { SpuData } from '@/api/project/spu/type';

let categoryStore = useCategoryStore();
let scene = ref<number>(0);
let pageNo = ref<number>(1);
let pageSize = ref<number>(3);
let totalNum = ref<number>(0);
let records = ref<Records>([]);
let spu = ref<any>();

watch(() => categoryStore.c3Id, (newValue, oldValue) => {
    if (!categoryStore.c3Id) return;
    getSpuList()
});
const getSpuList = async (pager = 1) => {
    pageNo.value = pager;
    let result: SpuResponseData = await reqSpuData(pageNo.value, pageSize.value, categoryStore.c3Id);
    if (result.code === 200) {
        records.value = result.data.records;
        totalNum.value = result.data.total;
    }
}
const addSpu = () => {
    scene.value = 1;
    spu.value.initAddSpuData(categoryStore.c3Id);
}
const updateSpu = (row: SpuData) => {
    scene.value = 1;
    spu.value.initHasSpuData(row);
}
const changeScene = (obj: any) => {
    scene.value = obj.flag;
    if (obj.params === 'update') {
        getSpuList(pageNo.value);
    } else {
        getSpuList();
    }
}

</script>

<style scoped></style>