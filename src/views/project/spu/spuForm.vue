<template>
    <el-form label-width="100px">

        <el-form-item label="spu名称">
            <el-input placeholder="请输入spu名称" v-model="SpuParams.spuName" clearable />
        </el-form-item>

        <el-form-item label="spu品牌">
            <el-select v-model="SpuParams.tmId" style="width: 240px;">
                <el-option v-for="item in allTrademark" :label="item.tmName" :key="item.id"
                    :value="item.id"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="spu描述">
            <el-input type="textarea" placeholder="请输入spu描述" v-model="SpuParams.description" clearable />
        </el-form-item>

        <el-form-item label="spu图片">
            <el-upload v-model:file-list="imageList" action="http://localhost:9000/image/uploadImage"
                list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                :before-upload="handlerUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </el-form-item>

        <el-form-item label="spu销售属性">
            <div style="display: flex; align-items: center;">
                <el-select v-model="saleAttrIdAndName"
                    :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'"
                    style="width: 150px;">
                    <el-option v-for="item in unSelectSaleAttr" :label="item.name" :key="item.id"
                        :value="`${item.id}:${item.name}`"></el-option>
                </el-select>
                <el-button @click="addSaleAttr" :disabled="saleAttrIdAndName ? false : true" style="margin-left: 10px;"
                    type="primary" size="default" icon="Plus">添加销售属性</el-button>
            </div>
            <el-table border style="margin: 10px 0px;" :data="spuSaleAttrList">
                <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
                <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
                <el-table-column label="销售属性值">
                    <template #default="scope">
                        <el-tag style="margin:0px 5px;" @close="scope.row.spuSaleAttrValueList.splice($index, 1)"
                            v-for="(tag, $index) in scope.row.spuSaleAttrValueList" :key="scope.row.id" class="mx-1"
                            closable>
                            {{ tag.saleAttrValueName }}
                        </el-tag>
                        <el-input @blur="toLook(scope.row)" v-model="scope.row.saleAttrValue"
                            v-if="scope.row.flag === true" placeholder="请输入属性值" size="small"
                            style="width: 100px;"></el-input>
                        <el-button v-else type="primary" size="small" @click="toEdit(scope.row)" icon="Plus">
                        </el-button>

                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{ row, $index }">
                        <el-button type="primary" size="small" icon="Delete" @click="spuSaleAttrList.splice($index, 1)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>

        <el-form-item>
            <el-button :disabled="spuSaleAttrList.length === 0" type="primary" size="default"
                @click="save">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-form-item>

    </el-form>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { SpuData } from '@/api/project/spu/type';
import { reqAddOrUpdateSpu, reqAllTrademark, reqSpuImageList, reqSpuSaleAttrList, reqAllSaleAttr } from '@/api/project/spu'
// 引入 UploadUserFile 类型
import type { UploadUserFile } from 'element-plus/lib/components/index.js';
import type { SpuSaleAttrValue,SaleAttrName, SpuTrademark, AllTrademark, SpuImage, SpuHasImage, SpuSaleAttrResponse, SpuSaleAttr, SaleAttrNameResponse } from '@/api/project/spu/type';
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene']);
const cancel = () => {
    $emit('changeScene', { flag: 0, params: 'update' })
}

let allTrademark = ref<SpuTrademark[]>([]);
let imageList = ref<SpuImage[]>([]);
let spuSaleAttrList = ref<SpuSaleAttr[]>([]);
let allSaleAttrList = ref<SaleAttrName[]>([]);
let SpuParams = ref<SpuData>({
    spuName: '',
    description: '',
    category3Id: '',
    tmId: '',
    spuSaleAttrList: [],
    spuImageList: []
});
let dialogVisible = ref<boolean>(false);
let dialogImageUrl = ref<string>('');
let saleAttrIdAndName = ref<string>('');

const initHasSpuData = async (spu: SpuData) => {
    SpuParams.value = spu;
    //获取全部品牌数
    let result1: AllTrademark = await reqAllTrademark();
    //获取Spu图片
    let result2: SpuHasImage = await reqSpuImageList((spu.id as number));
    //获取Spu销售属性
    let result3: SpuSaleAttrResponse = await reqSpuSaleAttrList((spu.id as number));
    //获取全部销售属性
    let result4: SaleAttrNameResponse = await reqAllSaleAttr();

    allTrademark.value = result1.data;
    imageList.value = result2.data.map((item) => {
        return {
            name: item.imageName,
            url: 'http://localhost:9000' + item.imageUrl,
            imageUrl: item.imageUrl
        }
    });
    spuSaleAttrList.value = result3.data;
    allSaleAttrList.value = result4.data;
}

const initAddSpuData = async (c3Id: number | string) => {
    //清空数据
    Object.assign(SpuParams.value, {
        category3Id: "",//收集三级分类的ID
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
    });
    //清空照片
    imageList.value = [];
    //清空销售属性
    spuSaleAttrList.value = [];
    saleAttrIdAndName.value = '';
    SpuParams.value.category3Id = c3Id;
    //获取全部品牌数
    let result1: AllTrademark = await reqAllTrademark();
    //获取全部销售属性
    let result4: SaleAttrNameResponse = await reqAllSaleAttr();
    allTrademark.value = result1.data;
    allSaleAttrList.value = result4.data;
}


const handlePictureCardPreview = (file: UploadUserFile) => {
    dialogImageUrl.value = file.url as string;
    dialogVisible.value = true;
};
const handleRemove = (file: UploadUserFile) => {
};
const handlerUpload = (file: any) => {
    if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif') {
        return true;
    } else {
        return false;
    }
}

let unSelectSaleAttr = computed(() => {
    return allSaleAttrList.value.filter(item => {
        return !spuSaleAttrList.value.some(spuItem => spuItem.baseSaleAttrId === item.id)
    })
})

const addSaleAttr = () => {
    let [id, name] = saleAttrIdAndName.value.split(':');
    spuSaleAttrList.value.push({
        baseSaleAttrId: Number(id),
        saleAttrName: name,
        spuSaleAttrValueList: []
    })
    saleAttrIdAndName.value = '';
}

const toEdit = (row: SpuSaleAttr) => {
    row.flag = true;
    row.saleAttrValue = ''
}

const toLook = (row: SpuSaleAttr) => {
  const value = row.saleAttrValue?.trim(); // 使用可选链防止 undefined

    if (!value) {
        ElMessage.error('属性值不能为空');
        row.saleAttrValue = '';
        return;
    }

    const isExist = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === value);
    if (isExist) {
        ElMessage.error('属性值不能重复');
        row.saleAttrValue = '';
        return;
    }

    row.spuSaleAttrValueList.push({
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: value, // 确保是字符串
        saleAttrName: row.saleAttrName
    });

    row.saleAttrValue = '';
    row.flag = false;
}

const save = async () => {
    SpuParams.value.spuImageList = imageList.value.map((item: any) => {
        return {
            imageName: item.name,
            imageUrl: (item.response && item.response.data.imageUrl) || item.imageUrl,
        }
    })

    SpuParams.value.spuSaleAttrList = spuSaleAttrList.value

    let result = await reqAddOrUpdateSpu(SpuParams.value);
    if (result.code === 200) {
        ElMessage.success(SpuParams.value.id ? '更新成功' : '新增成功');
        $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' });
    } else {
        ElMessage.error(SpuParams.value.id ? '更新失败' : '新增失败')
    }
}

defineExpose({
    initHasSpuData,
    initAddSpuData
})
</script>

<style scoped></style>
