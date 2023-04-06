<template>
    <div class="container">
        <div class="handle-box">
                <!-- <el-input v-model="query.task_name" placeholder="task name" class="handle-input mr10"></el-input> -->
                <el-autocomplete
                    v-model="query.task_name"
                    :fetch-suggestions="querySearch"></el-autocomplete>
                <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        </div>
    </div>
</template>

<script setup lang="ts" name="workers">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Calendar } from "@element-plus/icons-vue";
import { fetchData } from "../api/tasks";

const query = ref({
    task_name: ''
});


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

const taskData = ref<TaskItem[]>([]);

const getData = () => {
    fetchData().then(res => {
        taskData.value = res.data.list;
    });
};
getData();

// 查询操作
const handleSearch = () => {
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

function querySearch(input_str:string , callback: any) {
    var options = {
        onSearchComplete: function(res: any) {
            var arr = [];
        }
    }
}
</script>

<style scoped>

</style>