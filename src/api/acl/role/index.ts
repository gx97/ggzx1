import request from "@/utils/request";
import type { AssignPermissionParams,MenuTreeResponse,Role,RoleListResponse } from "./type";

enum Api {
  //查询角色列表
  USER_ROLE_LIST_URL = "/acl/role/",
  //添加角色
  ADD_ROLE_URL = "/acl/role/save",
  //修改角色
  UPDATE_ROLE_URL = "/acl/role/update",
  //删除角色
  DELETE_ROLE_URL = "/acl/role/remove/",
  //获取权限
  GET_PERMISSION_URL = "/acl/permission/toAssign/",
  //给角色分配权限
  ASSIGN_PERMISSION_URL = "/acl/permission/doAssign",
}

export const reqUserRoleList = (page: number, limit: number,roleName: string) =>
  request.get<any, RoleListResponse>(Api.USER_ROLE_LIST_URL + `${page}/${limit}?roleName=${roleName}`);

export const reqAddOrUpdateRole = (data: Role) => {
  if (!data.id) {
    return request.post<Role, any>(Api.ADD_ROLE_URL, data);
  } else {
    return request.put<Role, any>(Api.UPDATE_ROLE_URL, data);
  }
};

export const reqDeleteRole = (id: number) =>
  request.delete<any, any>(Api.DELETE_ROLE_URL + id);

export const reqGetPermission = (roleId: number) =>
  request.get<number, MenuTreeResponse>(Api.GET_PERMISSION_URL + roleId);

export const reqAssignPermission = (data: AssignPermissionParams) =>
  request.post<AssignPermissionParams, any>(Api.ASSIGN_PERMISSION_URL, data);
