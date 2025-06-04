import request from "@/utils/request";
import type { PermissionParam,PermissionTreeResponse } from "./type";

enum Api {
  //查询菜单树
  PERMISSION_TREE_URL = "/acl/permission",
  //添加菜单
  ADD_PERMISSION_URL = "/acl/permission/save",
  //修改菜单
  UPDATE_PERMISSION_URL = "/acl/permission/update",
  //删除菜单
  DELETE_PERMISSION_URL = "/acl/permission/remove/",
  //根据角色获取菜单
  GET_PERMISSION_URL = "/acl/permission/toAssign/",
  //给角色分配菜单
  ASSIGN_PERMISSION_URL = "/acl/permission/doAssign",

}

export const reqPermissionTree = () =>
  request.get<any, PermissionTreeResponse>(Api.PERMISSION_TREE_URL);

export const reqAddOrUpdatePermission = (data: PermissionParam) =>{
  if (!data.id) {
    return request.post<PermissionParam, any>(Api.ADD_PERMISSION_URL, data);
  } else {
    return request.put<PermissionParam, any>(Api.UPDATE_PERMISSION_URL, data);
  }
}

export const reqDeletePermission = (id: number) =>
  request.delete<any, any>(Api.DELETE_PERMISSION_URL + id);
