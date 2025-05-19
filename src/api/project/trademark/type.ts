//出参
export interface responseData{
    code: number;
    message: string;
    ok: boolean;
}

//品牌ts类型
export interface Trademark {
    id?: number;
    tmName: string;
    logoUrl: string;
}

//品牌数组
export type Records = Trademark[];

//品牌列表ts类型
export interface TrademarkListResponseData extends responseData {
    data:{
        records: Records;
        total: number;
        size: number;
        current: number;
        pages: number;
        searchCount: boolean;
    }
}