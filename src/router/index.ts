import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/tasks',
                name: 'tasks',
                meta: {
                    title: 'Tasks',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "Tasks" */ '../views/Tasks.vue'),
            },
            {
                path: '/workers',
                name: 'workers',
                meta: {
                    title: 'Workers',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "Workers" */ '../views/Workers.vue'),
            },
            {
                path: '/workbooks',
                name: 'workbooks',
                meta: {
                    title: 'Workbooks',
                    permiss: '4',
                },
                component: () => import(/* webpackChunkName: "Workbooks" */ '../views/Workbooks.vue'),
            },
            {
                path: '/sheets',
                name: 'sheets',
                meta: {
                    title: 'Sheets',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "Sheets" */ '../views/Sheets.vue'),
            },
            {
                path: '/sheettemplates',
                name: 'sheettemplates',
                meta: {
                    title: 'SheetTemplates',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "SheetTemplates" */ '../views/SheetTemplates.vue'),
            },
            {
                path: '/log',
                name: 'log',
                meta: {
                    title: 'Log',
                    permiss: '7',
                },
                component: () => import(/* webpackChunkName: "Log" */ '../views/Log.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;
