<template>
    <div>
        <el-card class="box-card">
            <el-button type="primary" size="default" icon="Plus" @click="addTrandemark">添加品牌</el-button>
            <!-- 表格组件 -->
            <el-table border style="margin: 10px 0px;" :data="trademarkArr" stripe>

                <el-table-column label="序号" width="80" align="center" type="index" />

                <el-table-column label="品牌名称">
                    <template #default="scope">
                        <pre color="red">{{ scope.row.tmName }}</pre>
                    </template>
                </el-table-column>

                <el-table-column label="品牌LOGO">
                    <template #default="scope">
                        <img :src="scope.row.logoUrl" alt="没有图片" style="width: 50px; height: 50px;" />
                    </template>
                </el-table-column>

                <el-table-column label="品牌操作">
                    <template #default="scope">
                        <el-button type="primary" size="small" icon="Edit"
                            @click="$event => updateTrandemark(scope.row)">修改</el-button>
                        <el-popconfirm :title="`确认删除吗${scope.row.tmName}?`" width="200" icon="Delete"
                            @confirm="$event => reqTrademarkRemove(scope.row.id)">
                            <template #reference>
                                <el-button>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分页器 -->
        <el-pagination style="margin: 10px 0px;" v-model:current-page="pageNo" v-model:page-size="pageSize"
            :page-sizes="[3, 5, 7, 9]" :small="false" :disabled="false" :background="true"
            layout=" prev, pager, next, jumper,->, sizes,total" :total="totalNum" @change="getTrademarkList(pageNo)" />

        <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">

            <el-form style="width: 500px;" label-position="right" ref="formRef" :model="trademarkParams" :rules="rules">

                <el-form-item label="品牌名称" label-width="80px" prop="tmName">
                    <el-input placeholder="输入品牌名" v-model="trademarkParams.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="80px" prop="logoUrl">

                    <el-upload class="avatar-uploader"
                        action="http://localhost:9000/product/baseTrademark/uploadPicture" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>

                </el-form-item>
            </el-form>

            <!-- 具名插槽：footer -->
            <template #footer>
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="confirm">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqTrademarkList, reqTrademarkAddOrUpdate, reqTrademarkDelete } from '@/api/project/trademark'
import type { Records, TrademarkListResponseData, Trademark, responseData } from "@/api/project/trademark/type";
import type { UploadProps, ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let totalNum = ref<number>(100)
let trademarkArr = ref<Records>([])
let dialogFormVisible = ref<boolean>(false)
let trademarkParams = reactive<Trademark>({
    tmName: '',
    logoUrl: '',
    id: undefined
})
let formRef = ref<InstanceType<typeof ElForm>>()

const getTrademarkList = async (pager = 1) => {
    const res: TrademarkListResponseData = await reqTrademarkList(pager, pageSize.value)
    if (res.code === 200) {
        pageNo.value = pager
        totalNum.value = res.data.total
        trademarkArr.value = res.data.records
    }
}

onMounted(() => {
    getTrademarkList()
})

const addTrandemark = () => {
    trademarkParams.tmName = ''
    trademarkParams.logoUrl = ''
    trademarkParams.id = undefined
    formRef.value?.clearValidate()
    // nextTick(() => {
    //     formRef.value.resetFields()
    // })
    dialogFormVisible.value = true
}
const updateTrandemark = (row: Trademark) => {
    formRef.value?.clearValidate()
    Object.assign(trademarkParams, row)
    dialogFormVisible.value = true
}
const cancel = () => {
    dialogFormVisible.value = false
}
const confirm = async () => {
    // 校验表单
    await formRef.value?.validate()

    const res: responseData = await reqTrademarkAddOrUpdate(trademarkParams)
    if (res.code === 200) {
        ElMessage.success('添加成功')
        getTrademarkList(trademarkParams.id ? pageNo.value : 1)
        dialogFormVisible.value = false
    } else {
        ElMessage.error('添加失败')
    }
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    trademarkParams.logoUrl = 'http://localhost:9000' + response.data.logoUrl
    formRef.value?.clearValidate('logoUrl')
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('Avatar picture must be JPG/png format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}

const validatorTmName = (rule: any, value: string, callback: any) => {
    if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error('长度在 2 到 10 个字符之间'))
    } else {
        callback()
    }
}
const validatorLogoUrl = (rule: any, value: string, callback: any) => {
    if (value.trim().length < 1) {
        callback(new Error('请上传品牌LOGO'))
    } else {
        callback()
    }
}
const rules = reactive({
    tmName: [
        { required: true, trigger: 'blur', validator: validatorTmName },
    ]
    ,
    logoUrl: [
        { required: true, trigger: 'blur', validator: validatorLogoUrl }
    ]
})

const reqTrademarkRemove = async (id: number) => {
    const res: responseData = await reqTrademarkDelete(id)
    if (res.code === 200) {
        ElMessage.success('删除成功')
        if(pageNo.value !== 1){
            getTrademarkList(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
        }else{
            getTrademarkList(pageNo.value)
        }
    } else {
        ElMessage.error('删除失败')
    }
}


</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>