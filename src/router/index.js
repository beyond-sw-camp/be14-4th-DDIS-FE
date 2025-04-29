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
        },
        {
            path: '/room',
            component: () => import('@/pages/RoomListPage.vue')
        },
        {
            path: '/post',
            component: () => import('@/pages/PostPage.vue')
        }
    ]
})

export default router