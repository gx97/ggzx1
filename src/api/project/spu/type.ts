//出参
export interface responseData {
  code: number;
  message: string;
  ok: boolean;
}

//SPU类型
export interface SpuData {
  id?: number;
  spuName: string;
  description: string;
  category3Id: number | string;
  tmId: number | string;
  spuSaleAttrList: null | SpuSaleAttr[];
  spuImageList: null | SpuImage[];
}

//数组
export type Records = SpuData[];

//返回数据的类型
export interface SpuResponseData extends responseData {
  data: {
    records: Records;
    total: number;
    size: number;
    current: number;
    pages: number;
    searchCount: boolean;
  };
}

// 品牌数据ts类型
export interface SpuTrademark {
  id: number;
  tmName: string;
  logoUrl: string;
}

export interface AllTrademark extends responseData {
  data: SpuTrademark[]
}

// SPU图片的ts类型
export interface SpuImage {
  id?: number;
  imageName?: string;
  imageUrl?: string;
  spuId?: number;
  name?: string;
  url?: string;
}

export interface SpuHasImage extends responseData {
  data: SpuImage[]
}

// SPU销售属性值类型
export interface SpuSaleAttrValue {
  id?: number;
  spuId?: number;
  spuSaleNameId?: number;
  baseSaleAttrId: number;
  saleAttrName?: string;
  saleAttrValueName: string;
  isChecked?: null;
  createTime?: null;
  updateTime?: null;
  // saleAttrValue?: string;
}
// SPU销售属性类型
export interface SpuSaleAttr {
  id?: number;
  spuId?: number;
  baseSaleAttrId: number;
  saleAttrName: string;
  createTime?: null;
  updateTime?: null;
  spuSaleAttrValueList: SpuSaleAttrValue[];
  flag?: boolean;
  saleAttrValue?: string;
}
// 最终响应数据类型
export interface SpuSaleAttrResponse extends responseData {
  data: SpuSaleAttr[];
}

// 销售属性名称类型
export interface SaleAttrName {
  id: number;
  name: string;
  createTime: null;
  updateTime: null;
}

// 最终响应数据类型
export interface SaleAttrNameResponse extends responseData {
  data: SaleAttrName[];
}

// 属性值
export interface SkuAttrValue {
  attrId: number;
  attrName: string;
  valueId: number;
  valueName: string;
}

// 销售属性值
export interface SkuSaleAttrValue {
  spuId: number;
  saleAttrId: number;
  saleAttrName: string;
  saleAttrValueId: number;
  saleAttrValueName: string;
}

// SKU 图片信息
export interface SkuImage {
  spuImgId: number;
  imageName: string;
  imageUrl: string;
  isDefault: number;
}

// Sku信息主数据
export interface SkuData {
  spuId: number|string;
  price: string;
  weight: string;
  skuName: string;
  skuDesc: string;
  skuDefaultImg: string;
  skuAttrValueList: SkuAttrValue[];
  skuSaleAttrValueList: SkuSaleAttrValue[];
  skuImageList: SkuImage[];
}
