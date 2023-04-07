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
