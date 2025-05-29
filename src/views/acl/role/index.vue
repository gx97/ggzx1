<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索：">
        <el-input v-model="searchName" placeholder="请输入职位关键字" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getRoleList(pageNo, pageSize, searchName)">搜索</el-button>
        <el-button type="primary" @click="reSetRoleList">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card style="margin: 10px 0px;">
    <el-button type="primary" size="default" @click="addRole">添加角色</el-button>

    <el-table :data="roleList" style="margin: 10px 0px;" border>
      <el-table-column type="index" label="#" />
      <el-table-column label="ID" prop="id" />
      <el-table-column label="职位名称" prop="roleName" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="更新时间" prop="updateTime" />
      <el-table-column label="操作">
        <template v-slot="{ row, $index }">
          <el-button type="primary" size="small" icon="Coordinate" @click="setPermission(row)">分配权限</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="editRole(row)">编辑</el-button>
          <el-popconfirm @confirm="deleteRole(row)" :title="`确定删除吗？`" confirmButtonType="primary"
            cancelButtonType="text" icon="el-icon-question" iconColor="#f90">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
      :background="true" layout="prev, pager, next, jumper,->, sizes,total " :total="totalNum"
      @change="getRoleList(pageNo, pageSize, '')" />
  </el-card>

  <el-dialog :before-close="cancelRole" v-model="dialogFormVisible" :title="roleParams.id ? '修改角色' : '添加角色'">
    <el-form style="width: 500px;" label-position="right" :model="roleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" label-width="80px" prop="roleName">
        <el-input placeholder="输入角色名" v-model="roleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <!-- 具名插槽：footer -->
    <template #footer>
      <el-button size="small" @click="cancelRole">取 消</el-button>
      <el-button type="primary" size="small" @click="confirmRole">确 定</el-button>
    </template>
  </el-dialog>

  <el-drawer destroy-on-close v-model="drawer" title="分配菜单与按钮的权限">
    <el-tree ref="tree" :data="menuList" show-checkbox node-key="id" default-expand-all
      :default-checked-keys="roleIdList" :props="defaultProps" />
    <template #footer>
      <div style="text-align: right;">
        <el-button type="primary" @click="savePermission">保存</el-button>
        <el-button type="primary" @click="drawer = false">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { reqAssignPermission, reqGetPermission, reqDeleteRole, reqAddOrUpdateRole, reqUserRoleList } from '@/api/acl/role';
import type { Menu, MenuTreeResponse, Role, RoleListResponse } from '@/api/acl/role/type';
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1);
let pageSize = ref<number>(5);
let totalNum = ref<number>(0);
let searchName = ref<string>('')
let roleList = ref<Role[]>([])
let dialogFormVisible = ref<boolean>(false)
let roleParams = ref<Role>({
  id: null,
  roleName: '',
  remark: '',
  createTime: '',
  updateTime: ''
})
let form = ref<any>();
let drawer = ref<boolean>(false);
let menuList = ref<Menu[]>([]);
let roleIdList = ref<number[]>([])
let tree = ref<any>();

onMounted(() => {
  getRoleList(pageNo.value, pageSize.value, '')
})

const getRoleList = async (page: number, limit: number, roleName: string) => {
  let result: RoleListResponse = await reqUserRoleList(page, limit, roleName);
  if (result.code === 200) {
    roleList.value = result.data.records;
    totalNum.value = result.data.total;
  } else {
    ElMessage.error('获取角色列表失败')
  }
};

const reSetRoleList = () => {
  pageNo.value = 1;
  pageSize.value = 5;
  searchName.value = '';
  getRoleList(pageNo.value, pageSize.value, '');
};

const cancelRole = () => {
  dialogFormVisible.value = false;
  roleParams.value = {
    id: null,
    roleName: '',
    remark: '',
    createTime: '',
    updateTime: ''
  };
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName');
  })
};

//自定义校验规则的回调
const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack();
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
//职位校验规则
const rules = {
  roleName: [
    { required: true, trigger: 'blur', validator: validatorRoleName }
  ]
}

//添加职位按钮的回调
const addRole = () => {
  //对话框显示出来
  dialogFormVisible.value = true;
  //清空数据
  Object.assign(roleParams, {
    roleName: '',
    id: 0
  });
  //清空上一次表单校验错误结果
  nextTick(() => {
    form.value.clearValidate('roleName');
  })

}

const editRole = (role: Role) => {
  roleParams.value = { ...role };
  dialogFormVisible.value = true;
};

const confirmRole = async () => {
  if (!roleParams.value.roleName) {
    ElMessage.error('请输入职位名称');
    return;
  }
  let result: any = await reqAddOrUpdateRole(roleParams.value);
  if (result.code === 200) {
    ElMessage.success(roleParams.value.id ? '修改角色成功' : '添加角色成功');
    dialogFormVisible.value = false;
    getRoleList(pageNo.value, pageSize.value, '');
  } else {
    ElMessage.error(roleParams.value.id ? '修改角色失败' : '添加角色失败');
  }
};

const deleteRole = async (role: Role) => {
  let result: any = await reqDeleteRole(role.id as number);
  if (result.code === 200) {
    ElMessage.success("删除角色成功");
    // 如果当前页为空且不是第一页，跳转到上一页
    if (roleList.value.length === 0 && pageNo.value > 1) {
      pageNo.value -= 1;
      await getRoleList(pageNo.value, pageSize.value, "");
    }
  } else {
    ElMessage.error("删除角色失败");
  }
};


const setPermission = async (role: Role) => {
  drawer.value = true;
  Object.assign(roleParams.value, role);
  let result: MenuTreeResponse = await reqGetPermission(role.id as number);
  menuList.value = result.data.permissionTree;
  roleIdList.value = result.data.permissionIdList;
};

const savePermission = async () => {
  // 获取全选和半选的节点ID
  const checkedKeys = tree.value.getCheckedKeys();
  const halfCheckedKeys = tree.value.getHalfCheckedKeys();

  // 合并权限ID（可根据业务决定是否需要半选）
  const permissionIds = [...checkedKeys, ...halfCheckedKeys];
  let result = await reqAssignPermission({
    roleId: roleParams.value.id as number,
    permissionId: permissionIds,
  });
  if (result.code === 200) {
    ElMessage.success("设置权限成功");
    drawer.value = false;
    // window.location.reload();
  } else {
    ElMessage.error("设置权限失败");
  }
};

const defaultProps = {
  children: 'children',
  label: 'name',
}

</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
