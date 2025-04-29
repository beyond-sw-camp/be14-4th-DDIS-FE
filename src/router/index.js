import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/personaltodo',
            component: () => import('@/pages/PersonalTodoPage.vue')
        },
        {
            path: '/report',
            component: () => import('@/pages/ReportPage.vue')
        },
        {
            path: '/sharetodopage',
            component: () => import('@/pages/ShareRoomPage.vue')
        },
        {
            path: '/login',
            component: () => import('@/pages/LoginPage.vue')
        }
    ]
})

export default router