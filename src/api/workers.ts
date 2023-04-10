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

export const queryWokers = (p_task_id: number) => {
    return request({
        url: '/api/workers/query',
        method: 'get',
        params: {
            task_id: p_task_id,
        }
    });
};

export const addWorker = (p_task_id: number) => {
    return request({
        url: '/api/workers/query',
        method: 'get',
        params: {
            task_id: p_task_id,
        }
    });
};