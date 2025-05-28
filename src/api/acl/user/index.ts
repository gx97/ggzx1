import request from "@/utils/request";
import type {UserRolesResponse, AssignRoleParams, UserListResponseData, User, AddUserParams } from "./type";

enum Api {
  //获取用户列表
  USER_URL = "/acl/user/",
  //删除用户
  DELETE_USER_URL = "/acl/user/remove/",
  //添加用户
  ADD_USER_URL = "/acl/user/save",
  //批量删除
  BATCH_DELETE_URL = "/acl/user/batchRemove",
  //修改用户
  UPDATE_USER_URL = "/acl/user/update",
  //分配角色
  ASSIGN_ROLE_URL = "/acl/user/doAssignRole",
  //获取角色
  GET_USER_ROLE_LIST_URL = "/acl/user/toAssign/",

}

export const reqUserList = (page: number, limit: number, username: string) =>
  request.get<any, UserListResponseData>(Api.USER_URL + `${page}/${limit}?username=${username}`);

export const reqDeleteUser = (id: number) =>
  request.delete<any, any>(Api.DELETE_USER_URL + id);

export const reqAddOrUpdateUser = (data: AddUserParams) => {
  if (data.id) {
    return request.put<AddUserParams, any>(Api.UPDATE_USER_URL, data);
  } else {
    request.post<AddUserParams, any>(Api.ADD_USER_URL, data);
  }
}

export const reqBatchDeleteUser = (idList: number[]) =>
  request.delete<any, any>(Api.BATCH_DELETE_URL, { data: idList });

export const reqUpdateUser = (data: AddUserParams) =>
  request.put<AddUserParams, any>(Api.UPDATE_USER_URL, data);

export const doAssignRole = (data: AssignRoleParams) => request.post<AssignRoleParams, any>(Api.ASSIGN_ROLE_URL, data);

export const getUserRoleList = (userId: number) => request.get<number, UserRolesResponse>(Api.GET_USER_ROLE_LIST_URL + userId);
