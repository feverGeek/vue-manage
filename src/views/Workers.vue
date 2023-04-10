<template>
    <div class="container">
        <div class="handle-box">
            <el-autocomplete 
                propper-class="autoTaskNameClass" v-model="query.task_name" :fetch-suggestions="querySearch" :trigger-on-focus="false"
                :clearable="true" placeholder="task name" @select="handleSelect"
            >
                <template #default="{ item }">
                    <div class="autoTaskNameClass_item">
                        <ElIcon :size="20" color="black">
                            <Search />
                        </ElIcon>
                        <div class="item_id">{{ item.id }}</div>
                        <span class="item_task_name">{{ item.task_name }} </span> 
                    </div>
                </template> 
            </el-autocomplete>
            <el-button type="primary" :icon="Plus" class="ml10" @click="handleAdd">新增</el-button>
        </div>
        <el-table :data="workerData" border class="worker" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="worker_name" label="Worker Name"></el-table-column>
            <el-table-column prop="task_name" label="Task Name"></el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template #default="scope">
                    <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
                        编辑
                    </el-button>
                    <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="query.pageIndex"
                :page-size="query.pageSize"
                :total="pageTotal"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>

        <!-- add -->
        <el-dialog title="新增" v-model="addVisible" width="30%">
            <el-form label-width="100px">
                <el-form-item label="task_id">
                    <el-autocomplete propper-class="autoTaskNameClass" v-model="query.add_form_input" :fetch-suggestions="querySearch" :trigger-on-focus="false" :clearable="true" placeholder="task name" @select="handleAddFormSelect">
                        <template #default="{ item }">
                            <div class="autoTaskNameClass_item">
                                <ElIcon :size="15" color="black">
                                    <Search />
                                </ElIcon>
                                <div class="item_id">{{ item.id }}</div>
                                <span class="item_task_name">{{ item.task_name }} </span> 
                            </div>
                        </template> 
                    </el-autocomplete>
                </el-form-item>

                <el-form-item label="worker_name">
                    <el-input v-model="addForm.worker_name">woker name</el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- edit -->
        <!-- <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form label-width="100px">
                <el-form-item label="task_name">
                    <el-input v-model="editForm.task_name"></el-input>
                </el-form-item>
                <el-form-item label="creator">
                    <el-input v-model="editForm.creator"></el-input>
                </el-form-item>
                <el-form-item label="start_time" width="100%">
                    <el-date-picker type="datetime" v-model="editForm.start_time" format="YYYY-MM-DD HH:mm:ss"
                        placeholder="start time" />
                </el-form-item>
                <el-form-item label="end_time">
                    <el-date-picker type="datetime" v-model="editForm.end_time" format="YYYY-MM-DD HH:mm:ss"
                        placeholder="end time" />
                </el-form-item>
                <el-form-item label="status">
                    <el-input v-model="editForm.status"></el-input>
                </el-form-item>
                <el-form-item label="access_code">
                    <el-input v-model="editForm.access_code"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog> -->
    </div>
</template>

<script setup lang="ts" name="workers">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Calendar } from "@element-plus/icons-vue";
import { queryTaskByName2,queryWokers } from "../api/workers";
import { AxiosPromise } from 'axios';

const query = reactive({
    task_name: '',
    add_form_input: '',
    loading: false,
    pageIndex: 1,
    pageSize: 10,
    options: null,
});
interface WorkerItem {
    id: number;
    task_name: string;
    worker_name: string;
    task_id: number;
}
const workerData = ref<WorkerItem[]>([]);
const pageTotal = ref(0);
const getData = () => {
    // fetchData().then(res => {
    //     workerData.value = res.data.list;
    // });
};
getData();
// 查询操作
const handleSearch = () => {
    getData();
}
// 分页导航
const handlePageChange = (val: number) => {
    // query.pageIndex = val;
    getData();
};
// 删除操作
const handleDelete = (index: number) => {
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    })
        .then(() => {
            ElMessage.success('删除成功');
            workerData.value.splice(index, 1);
        })
        .catch(() => { });
};
// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
    task_name: '',
    creator: '',
    create_time: '',
    start_time: '',
    end_time: '',
    status: '',
    route: '',
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
    idx = index;
    form.task_name = row.task_name;
    form.creator = row.creator;
    form.create_time = row.create_time;
    form.start_time = row.start_time;
    form.end_time = row.end_time;
    form.status = row.status;
    form.route = row.status;
    editVisible.value = true;
};

async function querySearch(this: any, queryString: string, cb: (results: AxiosPromise<any>) => void) {
  try {
    const results = await queryTaskByName2(queryString); // replace with your API call
    let data = results.data;
    if(data.data.info === '暂无数据'){
        data = [{'task_name': '暂无数据'}];
        cb(data);
    } else {
        cb(data.data.tasks);
    }
    
  } catch (error) {
    console.error(error);
  }
}


async function fetchAndPopulateResults(this: any) {
  try {
    query.loading = true;
    const results = queryTaskByName2(query.task_name); // replace with your API call
    const data = (await results).data.data.tasks;
    query.options = data;
    query.loading = false;
  } catch (error) {
    console.error(error);
    query.loading = false;
  }
}

async function handleSelect(item: any) {
    try {
        console.log(item);
        console.log(typeof(item));
        console.log(item.id);

        const results = await queryWokers(item.id);
        console.log(results);
        workerData.value = results.data.data.wokers;
        pageTotal.value = results.data.data.total;
    } catch (error) {
        console.log(error);
    }
}


// 新增
const addVisible = ref(false);
let addForm = reactive({
    worker_name: '',
    task_id: 0,
});
const handleAdd = () => {
    addVisible.value = true;
};
async function handleAddFormSelect(item: any) {
    try {
        console.log(item);
        console.log(typeof(item));
        console.log(item.id);
        query.add_form_input = item.id
    } catch (error) {
        console.log(error);
    }
}

const saveAdd = () => {
    addVisible.value = false;

    let workerItem = {
        worker_name: addForm.worker_name,
        task_id: addForm.task_id,
    };

    addWorker(taskItem).then(res => {
        if (res.data.code == 200) {
            ElMessage.success(res.data.data.info);
        }
        else {
            ElMessage.error(res.data.data.error);
        }
    });
};
</script>

<script lang="ts">
</script>

<style scoped lang="scss">
.handle-box {
    margin-bottom: 20px;
}
.mr10 {
    margin-right: 10px;
}
.ml10 {
    margin-left: 10px;
}
.autoTaskNameClass {
    li {
        .title {
            line-height: 30px;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .address {
            line-height: 1;
            font-size: 12px;
            color: #b4b4b4;
            margin-bottom: 5px;
        }
        .autoTaskNameClass_item {
            overflow: hidden;
            display: flex;
            align-items: center;
            .el-icon{
                margin-right: 20px;
            };
            
        }
    }
}

</style>