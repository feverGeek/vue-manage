<template>
    <div class="container">
        <div class="handle-box">
            <!-- <el-input v-model="query.task_name" placeholder="task name" class="handle-input mr10"></el-input> -->
            <el-autocomplete 
                propper-class="autoTaskNameClass"
                v-model="query.task_name" 
                :fetch-suggestions="querySearch" 
                :trigger-on-focus="false"
                placeholder="task name" 
                @select="handleSelect"
            >

                <template #default="{ item }">
                    <div class="autoTaskNameClass_item">
                        <ElIcon :size="20" color="black">
                            <Search />
                        </ElIcon>
                        <div class="task_name">{{ item.task_name }}</div>
                    </div>
                </template>
            </el-autocomplete>
            <el-button type="primary" :icon="Search" @click="handleSearch" class="ml10">搜索</el-button>
            <el-button type="primary" :icon="Plus">新增</el-button>
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
    </div>
</template>

<script setup lang="ts" name="workers">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Calendar } from "@element-plus/icons-vue";
import { fetchData } from "../api/workers";

const query = ref({
    task_name: '',
    pageIndex: 1,
    pageSize: 10,
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
    fetchData().then(res => {
        workerData.value = res.data.list;
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

function querySearch(input_str: string, callback: any) {
    var list = [{}];
    //调用的后台接口
    let url = '';
    //从后台获取到对象数组
    // workers.ts 
    // axios.get(url).then((response) => {
    //     //在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
    //     for (let i of response.data) {
    //         i.value = i.想要展示的数据; //将想要展示的数据作为value
    //     }
    //     list = response.data;
    //     callback(list);
    // }).catch((error) => {
    //     console.log(error);
    // });

}

function handleSelect(item: any) {
    
}
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