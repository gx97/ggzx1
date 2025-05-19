//出参
export interface responseData {
    code: number;
    message: string;
    ok: boolean;
}

//分类ts类型
export interface CategoryObj {
    id: number | string,
    name: string,
    category1Id?: number | string,
    category2Id?: number | string,
}


export interface CategoryResponseData extends responseData {
    data: CategoryObj[];
}

//属性值ts类型
export interface AttrValue {
    id?: number;
    valueName: string;
    attrId?: number;
    flag?: boolean;
}
export type AttrValueList = AttrValue[]

//属性ts类型
export interface Attr {
    attrName: string;
    attrValueList: AttrValueList;
    id?: number;
    categoryId?: number | string;
    categoryLevel?: number;
}
export type AttrList = Attr[]

export interface AttrResponseData extends responseData {
    data: AttrList;
}