//出参
export interface responseData {
  code: number;
  message: string;
  ok: boolean;
}


export interface PermissionTree {
  id: number;
  pid: number;
  name: string;
  code: string | null;
  type: number;
  level: number;
  select: boolean;
  createTime: string;
  updateTime: string;
  children: PermissionTree[] | null;
}

export interface PermissionTreeResponse extends responseData {
  data: PermissionTree[];
}

export interface PermissionParam {
  id: number | null;
  name: string;
  code: string;
  pid: number | null;
  type: number | null;
  level: number | null;
  // select: boolean;
  // createTime: string; // 日期格式字符串，如 "2025-06-04 15:06:19"
  // updateTime: string; // 同上
  // children: null | PermissionTree[]; // 可能为 null 或嵌套数组
}
