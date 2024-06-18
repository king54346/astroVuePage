<template>
  <div class="box">
    <el-row>
      <el-col :span="24">
        <span class="label"><el-icon><BellFilled /></el-icon>公告栏：</span>
        <NoticeBoard></NoticeBoard>
      </el-col>
    </el-row>
  </div>
  <div class="box">
    <div class="f-b">
      请先选择内存容量：
      <el-radio-group v-model="selectedmem">
        <el-radio :label="128">128G=80G</el-radio>
        <el-radio :label="256">256G=185G</el-radio>
        <el-radio :label="512">512G=400G</el-radio>
      </el-radio-group>
    </div>
    <div class="f-b">
      请先选择机型：
      <el-radio-group v-model="selectedtype">
        <el-radio :label="`NS`">NS普通机型</el-radio>
        <el-radio :label="`LITE`">LITE机型</el-radio>
        <el-radio :label="`OLED`">OLED机型</el-radio>
        <el-radio :label="`Endurance`">续航版</el-radio>
      </el-radio-group>
    </div>
  </div>
  <div class="box">
    <div class="game-table-header">
      <div>
        <el-button :icon="Plus" type="primary" @click="sendDataToChild">添加</el-button>
      </div>
      <div>
        <el-input
            v-model="seacrchvalue"
            style="width: 100%"
            placeholder="搜索"
            :suffix-icon="Search"
            @change="onChange"

        />
<!--        <el-select-v2-->
<!--            v-model="seacrchvalue"-->
<!--            :options="options"-->
<!--            placeholder="搜索"-->
<!--            style="width: 240px; margin-right: 16px; vertical-align: middle"-->
<!--            allow-create-->
<!--            filterable-->
<!--            multiple-->
<!--            clearable-->
<!--            :reserve-keyword="false"-->
<!--            @change="onChange"-->
<!--        />-->
      </div>
    </div>
    <div>
      <el-table
          :data="currentPageData"
          style="width: 100%"
          row-key="id"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="name" label="语言/游戏名"></el-table-column>
        <el-table-column prop="size" label="容量（GB）"></el-table-column>
        <el-table-column prop="info" label="标签">
          <template #default="{ row }">
            <el-tag
                v-for="(tag, index) in row.tags"
                :key="index"
                type="info"
                style="margin-right: 5px"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="tableData.length"
          background
          small
          style="margin-top: 10px;"
      ></el-pagination>
    </div>
  </div>
  <SideToolbar ref="sideToolbarRef" :type="selectedtype" :mem="selectedmem"/>

</template>

<script lang="tsx" setup>
import {
  ElRow,
  ElCol,
  ElTag,
  ElTable,
  ElTableV2,
  ElTableColumn,
  TableV2FixedDir,
  ElIcon,
  ElTooltip,
  ElRadioGroup,
  ElRadio,
  ElInput,
  ElButton,
  ElSelectV2,
  ElPagination
} from 'element-plus';
import SideToolbar from "./SideToolbar/index.vue";
import NoticeBoard from "./NoticeBoard/index.vue";
import {onMounted, ref,computed } from 'vue';
import {
  Plus,
  Search,
  BellFilled
} from '@element-plus/icons-vue'
import { getGames } from "@/api/game.js";

// 搜索框的值
const options = []

const onChange=(v)=>{
  fetchGames(seacrchvalue.value)
}

const currentPage = ref(1);
const pageSize = ref(10);
const tableData = ref([]);

const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  return tableData.value.slice(start, end);
});


const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

const selectedtype = ref('NS'); // 默认选择的值
const selectedmem = ref(128); // 默认选择的值

const seacrchvalue = ref(''); // 默认选择的值
const selectedRows = ref([]);

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
  console.log('当前选中的行:', selectedRows.value);
}

const fetchGames = async (search="") => {
  try {
    const response = await getGames({search:search});
    tableData.value = response.data;
  } catch (error) {
    console.error("Failed to fetch games data:", error);
  }
};

const sideToolbarRef = ref();
console.log(sideToolbarRef)
onMounted(() => {
  if (sideToolbarRef.value) {
    sideToolbarRef.value.addData(selectedRows.value);
  }
  fetchGames()
});

const sendDataToChild = () => {
  if (sideToolbarRef.value) {
    sideToolbarRef.value.addData(selectedRows.value);
  }
};
</script>
<style scoped>
.game-recommendations {
  background-color: #f4f4f5; /* 轻灰色背景 */
  padding: 10px; /* 内边距 */
  border-radius: 4px; /* 轻微的圆角边框 */
}

.label {
  font-weight: bold; /* 加粗标签 */
  margin-right: 10px; /* 标签右侧的间距 */
}

.game-tag {
  margin-right: 8px; /* 标签之间的间距 */
  margin-bottom: 8px; /* 行间距 */
}

.box {

  background-color: #fff;
  border-radius: 8px;
  margin: 10px 0;
  padding: 10px;
}

.game-table-header {
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
}
</style>
