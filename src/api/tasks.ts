import request from '../utils/request';

export const fetchTasks = (p_page: number = 1, p_per_page: number = 10) => {
    return request({
        url: '/api/task/query',
        method: 'get',
        params: {
            page: p_page,
            per_page: p_per_page
        }
    });
};

export const queryTaskByName = (p_task_name: string = '', p_page: number = 1, p_per_page: number = 10) => {
    return request({
        url: '/api/task/query',
        method: 'get',
        params: {
            task_name: p_task_name,
            page: p_page,
            per_page: p_per_page
        }
    });
};


export const modifyTask = (taskItem: any) => {
    return request({
        url: '/api/task/modify',
        method: 'post',
        data: {
            task_id: taskItem.id,
            task_name: taskItem.task_name,
            creator: taskItem.creator,
            start_time: taskItem.start_time,
            end_time: taskItem.end_time,
            status: taskItem.status,
            access_code: taskItem.access_code,
        }
    });
};


export const addTask = (taskItem: any) => {
    return request({
        url: '/api/task/create',
        method: 'post',
        data: {
            task_name: taskItem.task_name,
            creator: taskItem.creator,
            start_time: taskItem.start_time,
            end_time: taskItem.end_time,
        }
    });
}


export const delTask = (id: number) => {
    return request({
        url: '/api/task/del',
        method: 'post',
        data: {
            task_id: id,
        }
    });
}
