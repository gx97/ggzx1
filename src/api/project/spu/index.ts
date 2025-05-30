import request from "@/utils/request";
import type {SkuInfoData, SkuData,SpuData, SpuResponseData, AllTrademark, SpuHasImage, SpuSaleAttrResponse, SaleAttrNameResponse } from './type'

enum Api {
    // 获取spu数据
    SPU_URL = "/product",
    // 获取全部品牌
    ALL_TRADEMARK_URL = '/product/baseTrademark/getTrademarkList',
    // 获取spu图片列表
    SPU_IMAGE_URL = '/product/spuImageList/',
    // 获取spu销售属性列表
    SPU_SALE_ATTR_URL = '/product/spuSaleAttrList/',
    // 获取SPU的全部销售属性
    ALL_SALE_ATTR_URL = '/product/baseSaleAttrList',
    //新增SPU
    SAVE_SPU_URL = '/product/saveSpuInfo',
    //更新SPU
    UPDATE_SPU_URL = '/product/updateSpuInfo',
    //追加SKU地址
    ADDSKU_URL = '/product/saveSkuInfo',
    //获取SKU列表
    FIND_SKU_URL = '/product/findBySpuId/',
    //删除SPU
    DELETE_SPU_URL = '/product/deleteSpu/'

}

export const reqSpuData = (page: number, limit: number, category3Id: number | string,) => request.get<any, SpuResponseData>(Api.SPU_URL + `/${page}/${limit}?category3Id=${category3Id}`);

export const reqAllTrademark = () => request.get<any, AllTrademark>(Api.ALL_TRADEMARK_URL);

export const reqSpuImageList = (spuId: number) => request.get<number, SpuHasImage>(Api.SPU_IMAGE_URL + spuId);

export const reqSpuSaleAttrList = (spuId: number) => request.get<number, SpuSaleAttrResponse>(Api.SPU_SALE_ATTR_URL + spuId);

export const reqAllSaleAttr = () => request.get<any, SaleAttrNameResponse>(Api.ALL_SALE_ATTR_URL);

export const reqAddOrUpdateSpu = (data: SpuData) => {
    if (data.id) {
        return request.post<SpuData, any>(Api.UPDATE_SPU_URL, data);
    } else {
        return request.post<SpuData, any>(Api.SAVE_SPU_URL, data);
    }
}

export const addSku = (data: SkuData) => request.post<SkuData, any>(Api.ADDSKU_URL, data);

export const reqFindSkuList = (spuId: number) => request.get<number, SkuInfoData>(Api.FIND_SKU_URL + spuId);

export const reqDeleteSpu = (spuId: number) => request.delete<number, any>(Api.DELETE_SPU_URL + spuId);
