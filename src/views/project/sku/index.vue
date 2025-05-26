<template>
  <el-card>
    <el-table :data="skuList" border style="margin: 10px 0px;">
      <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
      <el-table-column label="名称" width="150px" show-overflow-tooltip prop="skuName"></el-table-column>
      <el-table-column label="描述" width="150px" show-overflow-tooltip prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="250px">
        <template #default="scope">
          <img :src="'http://localhost:9000' + scope.row.skuDefaultImg" alt=""
            style="width: 100px;height: 100px;"></img>
        </template>
      </el-table-column>
      <el-table-column label="重量" width="150px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" width="450px" fixed="right">
        <template #="{ row, $index }">
          <el-button :type="row.isSale === 1 ? 'info' : 'primary'" size="small"
            :icon="row.isSale === 1 ? 'Bottom' : 'Top'" @click="updateSale(row)"></el-button>
          <el-button type="primary" size="small" icon="Edit"></el-button>
          <el-button type="info" size="small" icon="InfoFilled" @click="getSkuInfo(row)"></el-button>

          <el-popconfirm @confirm="deleteSku(row)" :title="`确定删除${row.skuName}吗？`" confirmButtonType="primary"
            cancelButtonType="text" icon="el-icon-question" iconColor="#f90">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>


        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[2, 3, 5, 7]"
      :background="true" layout="prev, pager, next, jumper,->, sizes,total " :total="totalNum"
      @change="getSkuList(pageNo)" />

    <el-drawer v-model="drawer" title="查看商品详情">
      <el-row>
        <el-col :span="6">名称</el-col>
        <el-col :span="18">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">描述</el-col>
        <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">价格</el-col>
        <el-col :span="18">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">平台属性</el-col>
        <el-col :span="18">
          <el-tag style="margin:5px;" v-for="item in skuInfo.skuAttrValueList" :key="item.attrId">{{ item.valueName
            }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">销售属性</el-col>
        <el-col :span="18">
          <el-tag style="margin:5px;" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.saleAttrId">{{
            item.saleAttrValueName }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">商品照片</el-col>
        <el-col :span="18">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.spuImgId">
              <img :src="item.imageUrl" alt=""></img>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>

    </el-drawer>

  </el-card>

</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { reqSkuDelete, reqSkuInfo, reqSkuData, reqSkuOnSale, reqSkuCancelSale } from '@/api/project/sku';
import type { SkuInfoData, SkuData, SkuInfoResposeData } from '@/api/project/sku/type';
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1);
let pageSize = ref<number>(2);
let totalNum = ref<number>(0);
let skuList = ref<SkuData[]>([]);
let drawer = ref<boolean>(false);
let skuInfo = ref<SkuData>({});


onMounted(() => {
  getSkuData();
});

const getSkuData = async (pager = 1) => {
  pageNo.value = pager;
  let result: SkuInfoResposeData = await reqSkuData(pageNo.value, pageSize.value);
  if (result.code === 200) {
    totalNum.value = result.data.total;
    skuList.value = result.data.records;
  }
};

const getSkuList = (page: number) => {
  getSkuData(page);
};

const updateSale = async (row: SkuData) => {
  if (row.isSale === 1) {
    let result = await reqSkuCancelSale((row.id as number));
    if (result.code === 200) {
      ElMessage.success('下架成功');
      getSkuData(pageNo.value);
    }
  } else {
    let result = await reqSkuOnSale((row.id as number));
    if (result.code === 200) {
      ElMessage.success('上架成功');
      getSkuData(pageNo.value);
    }
  }
}

const getSkuInfo = async (row: SkuData) => {
  drawer.value = true;
  let result: SkuInfoData = await reqSkuInfo((row.id as number));
  if (result.code === 200) {
    skuInfo.value = result.data;
  }
}

const deleteSku = async (row: SkuData) => {
  let result = await reqSkuDelete((row.id as number));
  if (result.code === 200) {
    ElMessage.success('删除成功');
    getSkuData(skuList.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }else{
    ElMessage.error('删除失败');

  }
}

</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
