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
