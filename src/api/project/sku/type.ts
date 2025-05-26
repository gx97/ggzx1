//出参
export interface responseData {
  code: number;
  message: string;
  ok: boolean;
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
  id?: number;
  isSale?: number;
  spuId?: number | string;
  price?: string;
  weight?: string;
  skuName?: string;
  skuDesc?: string;
  skuDefaultImg?: string;
  skuAttrValueList?: SkuAttrValue[];
  skuSaleAttrValueList?: SkuSaleAttrValue[];
  skuImageList?: SkuImage[];
}

//获取sku信息ts
export interface SkuInfoResposeData extends responseData {
  data: {
    records: SkuData[]
    current: number; // 当前页
    pages: number; // 总页数
    total: number; // 总记录数
    size: number; // 每页大小
  }
}

export interface SkuInfoData extends responseData {
  data: SkuData;
}
