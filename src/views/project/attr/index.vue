<template>
    <div>
        <Category :scene="scene"></Category>
        <el-card style="margin: 10px 0px;">
            <div v-show="scene === 0">
                <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id === ''"
                    @click="addAttr">添加属性</el-button>
                <el-table border stripe style="width: 100%; margin: 10px 0px;" fit :data="attrList">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="属性名称" align="center" width="120px" prop="attrName"></el-table-column>
                    <el-table-column label="属性值名称" align="center" min-width="120px">
                        <template #default="scope">
                            <el-tag style="margin: 5px;" v-for="(item, index) in scope.row.attrValueList"
                                :key="item.id">{{ item.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="240px">
                        <template #default="scope">
                            <el-button type="primary" size="small" icon="Edit"
                                @click="updateAttr(scope.row)"></el-button>
                            <el-popconfirm :title="`确认删除${scope.row.attrName}吗`" width="200px"
                                @confirm="removeAttr(scope.row.id)">
                                <template #reference>
                                    <el-button type="danger" size="small" icon="Delete"></el-button>
                                </template>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div v-show="scene === 1">
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input placeholder="输入属性名称" v-model="attrParams.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button :disabled="attrParams.attrName ? false : true" type="primary" size="default" icon="Plus"
                    @click="addAttrValue">添加属性值</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
                <el-table border stripe style="width: 100%; margin: 10px 0px;" fit :data="attrParams.attrValueList">
                    <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #default="scope">
                            <el-input :ref="(vc: any) => inputArr[scope.$index] = vc" v-show="scope.row.flag"
                                @blur="toLook(scope.row, scope.$index)" v-model="scope.row.valueName"></el-input>
                            <div v-show="!scope.row.flag" @click="toEdit(scope)">{{ scope.row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值操作">
                        <template #default="scope">
                            <el-button type="danger" size="small" icon="Delete"
                                @click="attrParams.attrValueList.splice(scope.$index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" size="default" @click="saveAttr" :disabled="!canSave">保存</el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/stores/modules/category'
import { watch, ref, reactive, computed, nextTick, onBeforeUnmount } from 'vue'
import { getAttrList, addOrUpdateAttr, deleteAttr } from '@/api/project/attr';
import type { Attr, AttrValue } from "@/api/project/attr/type"
import { ElMessage } from 'element-plus';

let categoryStore = useCategoryStore();
let attrList = ref<Attr[]>([])
let scene = ref<number>(0);
let attrParams = reactive<Attr>({
    categoryId: "",
    categoryLevel: 3,
    attrName: '',
    attrValueList: []
})
let inputArr = ref<any[]>([])

watch(() => categoryStore.c3Id, (newValue, oldValue) => {
    attrList.value = [];
    if (categoryStore.c3Id) {
        getAttr();
    }
})
const getAttr = async () => {
    let result = await getAttrList(categoryStore.c1Id, categoryStore.c2Id, categoryStore.c3Id);
    if (result.code === 200) {
        attrList.value = result.data;
    }
}
const addAttr = () => {
    Object.assign(attrParams, {
        categoryId: categoryStore.c3Id,
        categoryLevel: 3,
        attrName: '',
        attrValueList: []
    })
    scene.value = 1;
}
const updateAttr = (row: Attr) => {
    scene.value = 1;
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
const removeAttr = async (attrId: number) => {
    let result: any = await deleteAttr(attrId);
    if (result.code === 200) {
        getAttr();
        ElMessage.success('删除属性成功')
    } else {
        ElMessage.error('删除属性失败')
    }
}
const cancel = () => {
    scene.value = 0;
}
const addAttrValue = () => {
    attrParams.attrValueList.push({
        valueName: '',
        flag: true
    });
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus();
    })
}
const saveAttr = async () => {
    let result: any = await addOrUpdateAttr(attrParams);
    if (result.code === 200) {
        getAttr();
        if (!attrParams.id) {
            ElMessage.success('添加属性成功')
        } else {
            ElMessage.success('修改属性成功')
        }
        scene.value = 0;
    } else {
        if (!attrParams.id) {
            ElMessage.error('添加属性失败')
        } else {
            ElMessage.error('修改属性失败')
        }
    }
}
const toLook = (row: AttrValue, $index: number) => {
    if (row.valueName === '') {
        attrParams.attrValueList.splice($index, 1);
        ElMessage.error('属性值不能为空')
        return;
    }
    attrParams.attrValueList.find(item => {
        if (item != row && item.valueName === row.valueName) {
            ElMessage.error('属性值不能重复')
            attrParams.attrValueList.splice($index, 1);
            return;
        }
    })
    row.flag = false;
}
const toEdit = (scope: any) => {
    scope.row.flag = true;
    nextTick(() => {
        inputArr.value[scope.$index].focus();
    })
}
const canSave = computed(() => {
    return attrParams.attrValueList.length > 0 && attrParams.attrValueList.every(item => item.valueName !== '');
})

onBeforeUnmount(() => {
    categoryStore.$reset();
})

</script>

<style scoped></style>