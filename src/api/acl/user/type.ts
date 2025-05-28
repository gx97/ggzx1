//出参
export interface responseData {
  code: number;
  message: string;
  ok: boolean;
}

export interface AddUserParams {
  id?: number;
  name: string;
  username: string;
  password?: string;
  roleIdList?: number[];
}

export interface User {
  id?: number;
  name: string;
  username: string;
  password: string;
  phone: null | string; // 假设phone可能是字符串或null
  avatar: null | string; // 同上
  desc: null | string; // 同上
  token: null | string; // 同上
  roleName: string;
  roles: any[]; // 可以进一步细化roles的类型，如果知道具体结构的话
  buttons: null | any; // 根据实际数据类型进行调整
  routes: null | any; // 根据实际数据类型进行调整
  createTime: string; // 日期时间格式字符串
  updateTime: string; // 日期时间格式字符串
}

export interface UserListResponseData extends responseData {
  data: {
    records: User[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
}


export interface AssignRoleParams {
  userId: number | null;
  roleIdList: number[];
}


// 定义角色类型
export interface Role {
  id: number;
  roleName: string;
  remark: string | null;
  createTime: string; // ISO 8601 格式时间字符串
  updateTime: string; // ISO 8601 格式时间字符串
}

export interface UserRolesResponse extends responseData {
  data: {
    assignRoles: Role[]; // 当前用户已分配的角色列表
    allRolesList: Role[]; // 所有可分配的角色列表
  };
}
