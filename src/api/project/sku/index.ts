import request from "@/utils/request";
import type { SkuInfoResposeData,SkuInfoData } from "./type";
enum Api {
  // 获取sku数据
  SKU_URL = "/product/list/",
  //上架
  SKU_ON_SALE_URL = "/product/onSale/",
  //下架
  SKU_CANCEL_SALE_URL = "/product/cancelSale/",
  //获取sku信息
  SKU_INFO_URL = "/product/getSkuInfo/",
  //删除sku
  SKU_DELETE_URL = "product/deleteSku/",

}

export const reqSkuData = (page: number, limit: number) => request.get<any, SkuInfoResposeData>(Api.SKU_URL + `${page}/${limit}`);

export  const reqSkuOnSale = (skuId: number) => request.get<number, any>(Api.SKU_ON_SALE_URL + skuId);

export  const reqSkuCancelSale = (skuId: number) => request.get<number, any>(Api.SKU_CANCEL_SALE_URL + skuId);

export  const reqSkuInfo = (skuId: number) => request.get<number, SkuInfoData>(Api.SKU_INFO_URL + skuId);

export  const reqSkuDelete = (skuId: number) => request.delete<number, any>(Api.SKU_DELETE_URL + skuId);
