<template>
  <el-container class="side-toolbar">
    <div class="button-container">
      <el-button circle size="large" class="wrap-text-button" @click="showMem">
        {{ usesize }}GB
      </el-button>
      <div class="button-label">已选容量</div>
    </div>
      <div class="button-container">
        <el-badge :max="99" :value="gridData.length" class="item" :hidden="gridData.length==0">
          <el-button @click="showModal = true" size="large" :icon="ShoppingCart" circle />
        </el-badge>
        <div class="button-label">已选游戏</div>
      </div>
  </el-container>
  <el-dialog
      title="选择的游戏详情"
      v-model="showModal"
      width="90%"
  >
    <el-form  :model="form" ref="formRef" label-width="80px">
      <el-form-item
          label="手机号"
          prop="phone"
          :rules="[{ required: true, message: '请输入手机号码', trigger: 'blur' }]"
      >
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
<!--      <el-form-item-->
<!--          label="订单号"-->
<!--          prop="order"-->
<!--          :rules="[{ required: true, message: '请输入订单号', trigger: 'blur' }]"-->
<!--      >-->
<!--        <el-input v-model="form.order"></el-input>-->
<!--      </el-form-item>-->
    </el-form>
    <el-table :data="gridData" row-key="id">
      <el-table-column
          prop="name"
          label="语言/游戏名"
      >
      </el-table-column>
      <el-table-column
          prop="size"
          label="容量（GB）"
      >
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button
              link
              type="primary"
              size="small"
              @click.prevent="deleteRow(scope.row.id)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showModal = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import {ElButton, ElContainer, ElBadge, ElDialog, ElTable, ElTableColumn, ElMessage,ElForm,ElFormItem,ElInput} from 'element-plus';
import {
  ShoppingCart
} from '@element-plus/icons-vue'

import {computed, ref,defineProps } from "vue";
import {postWorkOrder} from "@/api/game.js";

const props = defineProps<{
  type: string;
  mem: number;
}>();

const gridData = ref([
])
const form = ref({
  phone: '',
});

const showModal = ref(false);
// 使用计算属性自动管理 ID 和索引映射
const existingIdsMap = computed(() => {
  return new Map<number,number>(gridData.value.map((item, index) => [item.id, index]));
});
const usesize = ref(0)

const deleteRow = (id: number) => {
  const index = existingIdsMap.value.get(id);
  if (index !== undefined) {
    let splice = gridData.value.splice(index, 1);
    // 不需要手动更新 Map，computed 属性将自动处理
    usesize.value -= parseFloat(splice[0].size)
  }
};

// 函数来添加数据
const addData = (newData: any[]) => {
  const filteredData = newData.filter(item => !existingIdsMap.value.has(item.id));
  gridData.value.push(...filteredData);
  filteredData.map(res=>{
    usesize.value += parseFloat(res.size)
  })
  // 不需要手动添加新 id 到 Map，computed 属性将自动处理
};
const getMemoryValue = (mem) => {
  switch (mem) {
    case 128:
      return 80;
    case 256:
      return 185;
    case 512:
      return 400;
    default:
      return 0; // or any default value you prefer
  }
};
const showMem = ()=>{
  if (props.mem){
    const memoryValue = getMemoryValue(props.mem);
    if (memoryValue>=usesize.value){
      ElMessage.success(`剩余内存大小${memoryValue-usesize.value}G`)
    }else {
      ElMessage.error(`内存超出${usesize.value-memoryValue}G`)
    }
  }else{
    ElMessage.error("未选择内存大小")
  }
}

const getAllIds = () => {
  return gridData.value.map(item => item.id);
};

const formRef = ref(null);
const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await postWorkOrder({
          phone: form.value.phone,
          machine: props.type,
          sdcard: props.mem,
          games: getAllIds()
        });
        showModal.value = false;
        ElMessage.success('成功提交订单');
        // Reset form
        form.value = {
          phone: '',
        };
        // Reset gridData
        gridData.value = [];
        usesize.value = 0
      } catch (error) {
        ElMessage.error('Failed to submit work order');
      }
    } else {
      ElMessage.error('请输入完整信息');
    }
  });
}

defineExpose({addData})
</script>

<style scoped>
.side-toolbar {
  position: fixed;
  right: 30px;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1;
}
.button-label {
  text-align: center; /* 文本居中 */
  margin-top: 4px; /* 文本与按钮之间的间隔 */
  font-size: 14px; /* 文本大小 */
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.wrap-text-button {
  white-space: normal; /* 允许文本换行 */
  text-align: center; /* 文本居中 */
  line-height: 1.4; /* 调整行间距以改善可读性 */
  max-width: 140px; /* 设置最大宽度，根据需要调整 */
  overflow-wrap: break-word; /* 在长单词或URL内部断行 */
  font-size: 9px;
}
.side-toolbar .el-button + .el-button {
  margin-left: 0 !important;
}
</style>
