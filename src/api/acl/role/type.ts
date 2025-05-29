//出参
export interface responseData {
  code: number;
  message: string;
  ok: boolean;
}

export interface Role {
  id: number | null;
  roleName: string;
  remark: string | null;
  createTime: string; // 日期时间格式字符串
  updateTime: string; // 日期时间格式字符串
}

export interface RoleListResponse extends responseData {
  data: {
    records: Role[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
}

//菜单ts类型
export interface Menu {
  id: number;
  createTime: string; // 日期时间格式字符串
  updateTime: string; // 日期时间格式字符串
  pid: number | null;
  name: string;
  code: string | null;
  toCode: string | null;
  status: number | null;
  level: number | null;
  children: Menu[];
}

export interface MenuTreeResponse extends responseData {
  data: {
    permissionTree: Menu[];
    permissionIdList: number[];
  };
}

export interface AssignPermissionParams {
  roleId: number;
  permissionId: number[];
}
