<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.task_name" placeholder="task name" class="handle-input mr10"></el-input>
                <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table :data="taskData" border class="task" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="task_name" label="Task Name"></el-table-column>
                <el-table-column prop="creator" label="Creator"></el-table-column>
                <el-table-column prop="create_time" label="Create Time"></el-table-column>
                <el-table-column prop="start_time" label="Start Time"></el-table-column>
                <el-table-column prop="end_time" label="End Time"></el-table-column>
                <el-table-column prop="status" label="Status">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === '成功' ? 'success' : scope.row.status === '失败' ? 'danger' : ''">
                            {{ scope.row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="access_code" label="Access Code"></el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template #default="scope">
                        <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row.id, scope.row)" v-permiss="15">
                            编辑
                        </el-button>
                        <el-button text :icon="Delete" class="red" @click="handleDelete(scope.row.id)" v-permiss="16">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- edit -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
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
        </el-dialog>

        <!-- add -->
        <el-dialog title="新增" v-model="addVisible" width="30%">
            <el-form label-width="100px">
                <el-form-item label="task_name">
                    <el-input v-model="addForm.task_name"></el-input>
                </el-form-item>
                <el-form-item label="creator">
                    <el-input v-model="addForm.creator"></el-input>
                </el-form-item>
                <el-form-item label="start_time" width="100%">
                    <el-date-picker type="datetime" v-model="addForm.start_time" format="YYYY-MM-DD HH:mm:ss"
                        placeholder="start time" />
                </el-form-item>
                <el-form-item label="end_time">
                    <el-date-picker type="datetime" v-model="addForm.end_time" format="YYYY-MM-DD HH:mm:ss"
                        placeholder="end time" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script setup lang="ts" name="tasks">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Calendar } from "@element-plus/icons-vue";
import { fetchTasks, queryTaskByName, modifyTask, addTask, delTask } from "../api/tasks";
import moment from 'moment';

const username: string | null = localStorage.getItem('ms_username');

interface TaskItem {
    id: number;
    task_name: string;
    creator: string;
    create_time: string;
    start_time: string;
    end_time: string;
    status: string;
    access_code: string;
}

const query = reactive({
    task_name: '',
    pageIndex: 1,
    pageSize: 10
});

const taskData = ref<TaskItem[]>([]);
const pageTotal = ref(0);

const getData = () => {
    fetchTasks().then(res => {
        taskData.value = res.data.data.tasks;
        pageTotal.value = res.data.data.total;
    });
};
getData();

// 查询操作
const handleSearch = () => {
    query.pageIndex = 1;
    queryTaskByName(query.task_name, query.pageIndex, query.pageSize).then(res => {
        taskData.value = res.data.data.tasks;
        pageTotal.value = res.data.data.total || 0;
    });
}

// 分页导航
const handlePageChange = (val: number) => {
    query.pageIndex = val;
    fetchTasks(query.pageIndex).then(res => {
        taskData.value = res.data.data.tasks;
        pageTotal.value = res.data.data.total;
    });
};

// 删除操作
const handleDelete = (index: number) => {
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    }).then(() => {
        delTask(index).then(res => {
            if (res.data.code == 200) {
                ElMessage.success('删除成功');
                taskData.value.splice(index, 1);
                fetchTasks(query.pageIndex).then(res => {
                    taskData.value = res.data.data.tasks;
                    pageTotal.value = res.data.data.total;
                });
            } else {
                ElMessage.error(res.data.data.error);
            }
        });

    })
        .catch(() => { });
};
// 表格编辑时弹窗和保存
const editVisible = ref(false);
let editForm = reactive({
    task_name: '',
    creator: '',
    create_time: '',
    start_time: '',
    end_time: '',
    status: '',
    access_code: '',
});
let idx: number = -1;
let task_id: number = 0;
const handleEdit = (index:number, p_task_id: number, row: any) => {
    idx = index;
    task_id = p_task_id;
    editForm.task_name = row.task_name;
    editForm.creator = row.creator;
    editForm.create_time = row.create_time;
    editForm.start_time = row.start_time;
    editForm.end_time = row.end_time;
    editForm.status = row.status;
    editForm.access_code = row.access_code;
    editVisible.value = true;
};
const saveEdit = () => {
    editVisible.value = false;

    let taskItem = {
        id: task_id,
        task_name: editForm.task_name,
        creator: editForm.creator,
        start_time: moment(editForm.start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(editForm.end_time).format('YYYY-MM-DD HH:mm:ss'),
        status: editForm.status,
        access_code: editForm.access_code
    };

    modifyTask(taskItem).then(res => {
        
        if (res.data.code == 200) {
            console.log(idx);
            console.log(taskData.value[idx]);
            taskData.value[idx].task_name = editForm.task_name;
            taskData.value[idx].creator = editForm.creator;
            taskData.value[idx].start_time = moment(editForm.start_time).format('YYYY-MM-DD HH:mm:ss');
            taskData.value[idx].end_time = moment(editForm.end_time).format('YYYY-MM-DD HH:mm:ss');
            taskData.value[idx].status = editForm.status;
            taskData.value[idx].access_code = editForm.access_code;

            console.log(1);
            fetchTasks(query.pageIndex).then(res => {
                taskData.value = res.data.data.tasks;
                pageTotal.value = res.data.data.total;
            });
            ElMessage.success(res.data.data.info);
        }
        else {
            ElMessage.error(res.data.data.error);
        }
    });
};

// 新增
const addVisible = ref(false);
let addForm = reactive({
    task_name: '',
    creator: username,
    start_time: '',
    end_time: '',
});
const handleAdd = () => {
    addVisible.value = true;
};
const saveAdd = () => {
    addVisible.value = false;

    let taskItem = {
        task_name: addForm.task_name,
        creator: addForm.creator,
        start_time: moment(addForm.start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(addForm.end_time).format('YYYY-MM-DD HH:mm:ss'),
    };

    addTask(taskItem).then(res => {
        if (res.data.code == 200) {
            ElMessage.success(res.data.data.info);
        }
        else {
            ElMessage.error(res.data.data.error);
        }
    });

    fetchTasks(query.pageIndex).then(res => {
        taskData.value = res.data.data.tasks;
        pageTotal.value = res.data.data.total;
    });
};



</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
}

.task {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #F56C6C;
}

.mr10 {
    margin-right: 10px;
}

.task-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
