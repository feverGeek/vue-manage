<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.task_name" placeholder="task name" class="handle-input mr10"></el-input>
                <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" :icon="Plus">新增</el-button>
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
						<el-tag
							:type="scope.row.status === '成功' ? 'success' : scope.row.status === '失败' ? 'danger' : ''"
						>
							{{ scope.row.status }}
						</el-tag>
					</template>
                </el-table-column>
                <el-table-column prop="route" label="Route"></el-table-column>
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
        </div>

        <!-- editor -->
        <el-dialog title="edit" v-model="editVisible" width="30%">
            <el-form label-width="100px">
				<el-form-item label="task_name">
					<el-input v-model="form.task_name"></el-input>
				</el-form-item>
				<el-form-item label="creator">
					<el-input v-model="form.creator"></el-input>
				</el-form-item>
                <el-form-item label="start_time">
                    <el-time-picker v-model="form.start_time" arrow-control placeholder="start time"/>
				</el-form-item>
                <el-form-item label="end_time">
					<el-time-picker v-model="form.end_time" arrow-control placeholder="end time"/>
				</el-form-item>
                <el-form-item label="status">
					<el-input v-model="form.status"></el-input>
				</el-form-item>
                <el-form-item label="route">
					<el-input v-model="form.route"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="tasks">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Calendar } from "@element-plus/icons-vue";
import { fetchData } from "../api/tasks";

interface TaskItem {
    id: number;
    task_name: string;
    creator: string;
    create_time: string;
    start_time: string;
    end_time: string;
    status: string;
    route: string;
}

const query = reactive({
    task_name: '',
    pageIndex: 1,
    pageSize: 10
});

const taskData = ref<TaskItem[]>([]);
const pageTotal = ref(0);

const getData = () => {
    fetchData().then(res => {
        taskData.value = res.data.list;
        pageTotal.value = res.data.pageTotal || 50;
    });
};
getData();

// 查询操作
const handleSearch = () => {
    query.pageIndex = 1;
    getData();
}

// 分页导航
const handlePageChange = (val: number) => {
    query.pageIndex = val;
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
            taskData.value.splice(index, 1);
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
const saveEdit = () => {
    editVisible.value = false;
    ElMessage.success(`修改第 ${idx + 1} 行成功`);
    taskData.value[idx].task_name = form.task_name;
    taskData.value[idx].creator = form.creator;
    taskData.value[idx].start_time = form.start_time;
    taskData.value[idx].end_time = form.end_time;
    taskData.value[idx].status = form.status;
    taskData.value[idx].route = form.route;
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
