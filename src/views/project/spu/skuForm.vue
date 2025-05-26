<template>
  <el-form label-width="100px">
    <el-form-item label="sku名称">
      <el-input v-model="skuParams.skuName" placeholder="sku名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input v-model="skuParams.price" placeholder="价格(元)" type="number"></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input v-model="skuParams.weight" placeholder="重量(g)" type="number"></el-input>
    </el-form-item>
    <el-form-item label="sku描述">
      <el-input v-model="skuParams.skuDesc" placeholder="sku描述" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in attrArr" :label="item.attrName" :key="item.id">
          <el-select v-model="item.attrIdAndValueId" placeholder="请选择">
            <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, attrIndex) in item.attrValueList"
              :label="attrValue.valueName" :key="attrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in saleArr" :label="item.saleAttrName" :key="item.id">
          <el-select v-model="item.saleIdAndValueId" placeholder="请选择">
            <el-option :value="`${item.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, saleAttrIndex) in item.spuSaleAttrValueList"
              :label="saleAttrValue.saleAttrValueName" :key="saleAttrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row, $index }">
            <el-image :src="'http://localhost:9000' + row.imageUrl" style="width: 100px; height: 100px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imageName"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row, $index }">
            <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script setup lang="ts">
import type { SpuData } from '@/api/project/spu/type';
import { getAttrList } from '@/api/project/attr';
import { addSku, reqSpuImageList, reqSpuSaleAttrList } from '@/api/project/spu';
import type { SkuData } from '@/api/project/spu/type';
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus'

let attrArr = ref<any>([])
let saleArr = ref<any>([])
let imgArr = ref<any>([])
let skuParams = reactive<SkuData>({
  spuId: "",
  price: "",
  weight: "",
  skuName: "",
  skuDesc: "",
  skuDefaultImg: "",
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuImageList: [],
})
let table = ref<any>()


const initSkuData = async (c1Id: number | string, c2Id: number | string, row: SpuData) => {
  //清空sku数据
  Object.assign(skuParams, {
    spuId: "",
    price: "",
    weight: "",
    skuName: "",
    skuDesc: "",
    skuDefaultImg: "",
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuImageList: [],
  })

  //收集数据
  skuParams.spuId = row.id ?? ''; // 使用空值合并运算符处理 undefined

  //获取平台属性
  let result1 = await getAttrList(c1Id, c2Id, row.category3Id);
  attrArr.value = result1.data;
  if (row.id !== undefined) {
    //获取spu图片
    let result2 = await reqSpuImageList(row.id);
    imgArr.value = result2.data;
    //获取销售属性
    let result3 = await reqSpuSaleAttrList(row.id);
    saleArr.value = result3.data;
  }


}

const handler = (row: any) => {
  table.value.clearSelection();
  table.value.toggleRowSelection(row, true);
  skuParams.skuDefaultImg = row.imageUrl;
}

const save = async () => {
  skuParams.skuAttrValueList = attrArr.value.reduce((pre: any, cur: any) => {
    if (cur.attrIdAndValueId) {
      let [attrId, valueId] = cur.attrIdAndValueId.split(':')
      pre.push({
        attrId: attrId,
        valueId: valueId
      })
    }
    return pre;
  }, [])

  skuParams.skuSaleAttrValueList = saleArr.value.reduce((pre: any, cur: any) => {
    if (cur.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = cur.saleIdAndValueId.split(':')
      pre.push({
        saleAttrId: saleAttrId,
        saleAttrValueId: saleAttrValueId
      })
    }
    return pre;
  }, [])

  let result = await addSku(skuParams);
  if (result.code === 200) {
    ElMessage.success('添加成功')

    $emit('changeScene', { flag: 0, params: 'update' })
  } else {
    ElMessage.error('添加失败')
  }
}

let $emit = defineEmits(['changeScene'])
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

defineExpose({
  initSkuData
})

</script>

<style scoped>
.el-select {
  width: 150px;
}
</style>
