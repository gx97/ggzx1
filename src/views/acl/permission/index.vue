<template>
  <div>
    <el-table :data="permissionTree" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column prop="name" label="名称" sortable />
      <el-table-column prop="code" label="权限值" sortable />
      <el-table-column prop="updateTime" label="修改时间" sortable />
      <el-table-column label="操作" sortable>
        <template v-slot="{ row, $index }">
          <el-button :disabled="row.level === 4" type="primary" size="small" icon="Coordinate"
            @click="openPermission(row)">{{ row.level === 3
              ? '添加功能' : '添加菜单' }}</el-button>
          <el-button v-show="row.id !== 1" type="primary" size="small" icon="Edit"
            @click="editPermission(row)">编辑</el-button>
          <el-popconfirm @confirm="deletePermission(row)" :title="`确定删除吗？`" confirmButtonType="primary"
            cancelButtonType="text" icon="el-icon-question" iconColor="#f90">
            <template #reference>
              <el-button v-show="row.id !== 1" type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog destroy-on-close v-model="dialogFormVisible" :title="permissionParam.id ? '修改菜单' : '添加菜单'">
    <el-form style="width: 500px;" label-position="right" :model="permissionParam" :rules="rules" ref="form">
      <el-form-item label="名称" label-width="80px" prop="name">
        <el-input placeholder="输入菜单名" v-model="permissionParam.name"></el-input>
      </el-form-item>
      <el-form-item label="权限" label-width="80px" prop="code">
        <el-input placeholder="输入权限名" v-model="permissionParam.code"></el-input>
      </el-form-item>
    </el-form>
    <!-- 具名插槽：footer -->
    <template #footer>
      <el-button size="small" @click="cancelPermissonDiag">取 消</el-button>
      <el-button type="primary" size="small" @click="savePermission">确 定</el-button>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { reqDeletePermission, reqAddOrUpdatePermission, reqPermissionTree } from '@/api/acl/permission';
import type { PermissionParam, PermissionTreeResponse, PermissionTree } from '@/api/acl/permission/type';
import { ElMessage } from 'element-plus'

let permissionTree = ref<PermissionTree[]>([]);
let dialogFormVisible = ref<boolean>(false)
let form = ref<any>();

let permissionParam = ref<PermissionParam>({
  id: null,
  name: '',
  code: '',
  pid: null,
  type: null,
  level: null,
})

onMounted(() => {
  getPermissionTree();
})

const getPermissionTree = async () => {
  let result: PermissionTreeResponse = await reqPermissionTree();
  if (result.code === 200) {
    permissionTree.value = result.data;
  }
}

const openPermission = (row: PermissionTree) => {
  permissionParam.value.pid = row.id;
  permissionParam.value.level = row.level + 1;
  permissionParam.value.type = row.level === 3 ? 2 : 1;
  dialogFormVisible.value = true;
}

const editPermission = async (row: PermissionTree) => {
  Object.assign(permissionParam.value, row);
  dialogFormVisible.value = true;
}

const cancelPermissonDiag = () => {
  dialogFormVisible.value = false;
  permissionParam.value = {
    id: null,
    name: '',
    code: '',
    pid: null,
    type: null,
    level: null,
  };
  //清空上一次表单校验错误结果
  form.value.clearValidate('roleName');
  // nextTick(() => {
  // })
}

const savePermission = async () => {
  let result = await reqAddOrUpdatePermission(permissionParam.value);
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: permissionParam.value.id ? '修改成功' : '保存成功'
    })
    getPermissionTree();
    cancelPermissonDiag();
  } else {
    ElMessage({
      type: 'error',
      message: permissionParam.value.id ? '修改失败' : '保存失败'
    })
  }
}

//自定义校验规则的回调
const validatorPermisson = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 1) {
    callBack();
  } else {
    callBack(new Error('不能为空'))
  }
}
//菜单校验规则
const rules = {
  name: [
    { required: true, trigger: 'blur', validator: validatorPermisson }
  ],
  code: [
    { required: true, trigger: 'blur', validator: validatorPermisson }
  ]
}

const deletePermission = async (row: PermissionTree) => {
  const result = await reqDeletePermission(row.id)
  if (result.code === 200) {
    getPermissionTree()
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    cancelPermissonDiag();
  }else{
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

</script>

<style scoped></style>
