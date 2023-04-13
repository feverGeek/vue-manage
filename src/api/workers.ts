import request from '../utils/request';

export const queryTaskByName2 = (p_task_name: string = '') => {
    return request({
        url: '/api/task/query2',
        method: 'get',
        params: {
            task_name: p_task_name,
        }
    });
};

export const queryWorkers = (p_task_id: number) => {
    return request({
        url: '/api/workers/query',
        method: 'get',
        params: {
            task_id: p_task_id,
        }
    });
};

export const addWorker = (workerItem: any) => {
    return request({
        url: '/api/workers/add',
        method: 'post',
        data: {
            task_id: workerItem.task_id,
            worker_name: workerItem.worker_name,
        }
    });
};

export const modifyWorker = (workerItem: any) => {
    return request({
        url: '/api/workers/modify',
        method: 'post',
        data: {
            worker_id: workerItem.worker_id,
            worker_name: workerItem.worker_name,
            task_id: workerItem.task_id
        }
    });
}

export const delWorker = (id: number) => {
    return request({
        url: '/api/workers/del',
        method: 'post',
        data: {
            worker_id: id
        }
    });
}