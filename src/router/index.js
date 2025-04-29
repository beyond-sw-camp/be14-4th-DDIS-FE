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
            path: '/notice',
            component: () => import('@/pages/notice/NoticePage.vue')
        },
        {
            path: '/notice/:id',
            component: () => import('@/pages/notice/NoticeDetailPage.vue')
        },
    
    ]
})

export default router