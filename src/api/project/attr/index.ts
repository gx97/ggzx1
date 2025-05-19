import request from "@/utils/request";
import type { CategoryResponseData, AttrResponseData, Attr } from "./type"

enum Api {
    // 一级分类
    C1_URL = "/product/getCategory1",
    // 二级分类
    C2_URL = "/product/getCategory2",
    // 三级分类
    C3_URL = "/product/getCategory3",
    // 属性列表
    ATTR_URL = "/product/attrInfoList",
    // 添加属性与修改属性
    ADD_UPDATE_ATTR_URL = "/product/saveAttrInfo",
    // 删除属性
    DELETE_ATTR_URL = "/product/deleteAttr/"

}

export const getC1List = () => request.get<any, CategoryResponseData>(Api.C1_URL);
export const getC2List = (category1Id: number | string) => request.get<any, CategoryResponseData>(Api.C2_URL + `/${category1Id}`);
export const getC3List = (category2Id: number | string) => request.get<any, CategoryResponseData>(Api.C3_URL + `/${category2Id}`);
export const getAttrList = (category1Id: number | string, category2Id: number | string, category3Id: number | string) => request.get<any, AttrResponseData>(Api.ATTR_URL + `/${category1Id}/${category2Id}/${category3Id}`);
export const addOrUpdateAttr = (data: Attr) => request.post<any, any>(Api.ADD_UPDATE_ATTR_URL, data);
export const deleteAttr = (attrId: number) => request.delete<any, any>(Api.DELETE_ATTR_URL + attrId);
