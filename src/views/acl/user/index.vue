<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名：">
        <el-input v-model="searchName" placeholder="请输入搜索的用户名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUserList(pageNo, pageSize, searchName)">搜索</el-button>
        <el-button type="primary" @click="getUserList(pageNo, pageSize, '')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card style="margin: 10px 0px;">
    <el-button type="primary" size="default" @click="setDrawerTrue">添加用户</el-button>
    <el-button type="danger" size="default" @click="deleteUserBacth">批量删除</el-button>

    <el-table @selection-change="selectUserId" style="margin: 10px 0px;" border :data="userList">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="用户名字" prop="username"></el-table-column>
      <el-table-column label="用户名称" prop="name"></el-table-column>
      <el-table-column label="用户角色" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="200px">
        <template v-slot="{ row, $index }">
          <el-button type="primary" size="small" @click="doAssign(row)">分配角色</el-button>
          <el-button type="primary" size="small" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm @confirm="deleteUser(row)" :title="`确定删除吗？`" confirmButtonType="primary"
            cancelButtonType="text" icon="el-icon-question" iconColor="#f90">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[2, 3, 5, 7]"
      :background="true" layout="prev, pager, next, jumper,->, sizes,total " :total="totalNum"
      @change="getUserList(pageNo, pageSize, '')" />
  </el-card>


  <el-drawer destroy-on-close v-model="drawer" :title="addUserParams.id ? '修改用户' : '添加用户'">
    <el-form :model="addUserParams" :rules="rules" label-width="100px" ref="formRef">
      <el-form-item label="用户名：" prop="name">
        <el-input v-model="addUserParams.name" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item label="用户昵称：" prop="username">
        <el-input v-model="addUserParams.username" placeholder="请输入用户昵称：" clearable />
      </el-form-item>
      <el-form-item label="用户密码：" prop="password" v-show="addUserParams.id === undefined">
        <el-input v-model="addUserParams.password" placeholder="请输入用户密码" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUser">保存</el-button>
        <el-button type="primary" @click="cancelAdd">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>

  <el-drawer destroy-on-close v-model="drawer1" title="分配角色">
    <el-form :model="addUserParams" label-width="100px">
      <el-form-item label="用户名：" prop="name">
        <el-input :disabled="true" v-model="addUserParams.name" clearable />
      </el-form-item>
      <el-form-item label="用户昵称：" prop="username">
        <el-input :disabled="true" v-model="addUserParams.username" clearable />
      </el-form-item>
      <el-form-item label="职位列表">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
          <el-checkbox v-for="(role, index) in allRole" :key="role.id" :label="role.id"> {{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

    </el-form>
    <template #footer>
      <div style="text-align: right;">
        <el-button type="primary" @click="setUser">保存</el-button>
        <el-button type="primary" @click="cancelSetUser">取消</el-button>
      </div>
    </template>
  </el-drawer>

</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { getUserRoleList, doAssignRole, reqBatchDeleteUser, reqDeleteUser, reqAddOrUpdateUser, reqUserList } from "@/api/acl/user/index";
import type { Role, UserRolesResponse, AssignRoleParams, AddUserParams, UserListResponseData, User } from "@/api/acl/user/type";
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'



let pageNo = ref<number>(1);
let pageSize = ref<number>(2);
let totalNum = ref<number>(0);
let userList = ref<User[]>([]);
let searchName = ref<string>("");
let addUserParams = reactive<AddUserParams>({
  name: '',
  username: '',
});
let assignRoleParams = reactive<AssignRoleParams>({
  userId: null,
  roleIdList: [],
});
let drawer = ref<boolean>(false);
let drawer1 = ref<boolean>(false);
let deleteIdList = ref<number[]>([])
let checkAll = ref<boolean>(false)
let isIndeterminate = ref<boolean>(true)
let checkedRoles = ref<number[]>([])
let allRole = ref<Role[]>([]);

onMounted(() => {
  getUserList(pageNo.value, pageSize.value, "");
});

const setDrawerTrue = () => {
  drawer.value = true;
  addUserParams = {
    name: '',
    username: '',
    password: '',
  };
};

const getUserList = async (page: number, limit: number, username: string) => {
  let result = await reqUserList(page, limit, username);
  if (result.code === 200) {
    userList.value = result.data.records;
    totalNum.value = result.data.total;
  } else {
    ElMessage.error("获取用户列表失败")
  }
};

const cancelAdd = () => {
  drawer.value = false;
  addUserParams = {
    name: '',
    username: '',
    password: '',
  };
}

const cancelSetUser = () => {
  drawer1.value = false;
  assignRoleParams = {
    userId: null,
    roleIdList: []
  }
}

const addUser = async () => {
  if (!formRef.value) return;

  // 触发表单验证
  try {
    const valid = await formRef.value.validate();
    if (valid) {
      // 验证通过，执行保存操作
      const result = await reqAddOrUpdateUser(addUserParams);
      if (result.code === 200) {
        ElMessage.success(addUserParams.id ? '更新成功' : '添加成功');
        getUserList(addUserParams.id ? pageNo.value : 1, pageSize.value, "");
        cancelAdd();
        window.location.reload();
      } else {
        ElMessage.error(addUserParams.id ? '更新失败' : '添加失败');
      }
    }
  } catch (error) {
    ElMessage.error("表单验证未通过");
  }
};

const updateUser = async (row: User) => {
  setDrawerTrue();
  addUserParams = {
    id: row.id,
    name: row.name,
    username: row.username,
    password: row.password,
  };

};

// 表单引用
const formRef = ref<FormInstance>()

// 验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 5, message: '用户名至少为5位字符', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '用户昵称不能为空', trigger: 'blur' },
    { min: 5, message: '用户昵称至少为5位字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码至少为6位字符', trigger: 'blur' }
  ]
}

const deleteUser = async (row: User) => {
  let result = await reqDeleteUser((row.id as number));
  if (result.code === 200) {
    ElMessage.success("删除用户成功");
    // 如果当前页为空且不是第一页，跳转到上一页
    if (userList.value.length === 0 && pageNo.value > 1) {
      pageNo.value -= 1;
      await getUserList(pageNo.value, pageSize.value, "");
    }
  } else {
    ElMessage.error("删除用户失败");
  }
}

const selectUserId = (userList: User[]) => {
  deleteIdList.value = userList
    .map((item: User) => item.id)
    .filter((id): id is number => id !== undefined);
};

const deleteUserBacth = async () => {
  if (deleteIdList.value.length === 0) {
    ElMessage.warning("请选择要删除的用户");
    return;
  }
  let result = await reqBatchDeleteUser(deleteIdList.value);
  if (result.code === 200) {
    ElMessage.success("删除用户成功");
    // 如果当前页为空且不是第一页，跳转到上一页
    if (userList.value.length === 0 && pageNo.value > 1) {
      pageNo.value -= 1;
      await getUserList(pageNo.value, pageSize.value, "");
    }
  } else {
    ElMessage.error("删除用户失败");
  }
};


const doAssign = async (row: User) => {
  drawer1.value = true;
  Object.assign(addUserParams, row);

  let result: UserRolesResponse = await getUserRoleList(addUserParams.id as number);
  allRole.value = result.data.allRolesList;
  checkedRoles.value = result.data.assignRoles.map(role => role.id);
};

const setUser = async () => {
  assignRoleParams.userId = addUserParams.id ?? null;
  assignRoleParams.roleIdList = checkedRoles.value;
  let result2 = await doAssignRole(assignRoleParams);
  if (result2.code === 200) {
    ElMessage.success("分配角色成功");
    cancelSetUser();
  } else {
    ElMessage.error("分配角色失败");
  }
}

const handleCheckAllChange = (val: any) => {
  // 提取所有角色的 id 组成 number[] 赋值给 checkedRoles
  checkedRoles.value = val ? allRole.value.map(role => role.id) : [];
  isIndeterminate.value = false;
};

const handleCheckedRolesChange = (value: any) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
};

</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
