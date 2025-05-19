import request from "@/utils/request";
import type { TrademarkListResponseData, Trademark, responseData } from "./type";

enum Api {
    // 品牌列表
    TRADEMARK_LIST = "/product/baseTrademark",
    // 品牌ICOM新增
    TRADEMARK_ICON_ADD = "/product/baseTrademark/uploadPicture",
    // 品牌新增
    TRADEMARK_ADD = "/product/baseTrademark/add",
    // 品牌编辑
    TRADEMARK_update = "/product/baseTrademark/update",
    // 品牌删除
    TRADEMARK_DELETE = "/product/baseTrademark/remove/",
}

export const reqTrademarkList = (page: number, limit: number) => 
    request.get<any, TrademarkListResponseData>(Api.TRADEMARK_LIST + `/${page}/${limit}`);

export const reqTrademarkAddOrUpdate = (data: Trademark) => {
    if (data.id) {
        return request.put<any, responseData>(Api.TRADEMARK_update, data);
    } else {
        return request.post<any, responseData>(Api.TRADEMARK_ADD, data);
    }
}

export const reqTrademarkDelete = (id: number) => 
    request.delete<any, TrademarkListResponseData>(Api.TRADEMARK_DELETE + id);
