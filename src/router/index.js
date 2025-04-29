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
            component: () => import('@/pages/NoticePage.vue')
        },
        {
            path: '/notice/:id',
            component: () => import('@/components/notice/NoticeDetailPage.vue')
        },
    
        {
            path: '/login',
            component: () => import('@/pages/LoginPage.vue')
        },
        { 
            path: '/inquiry',
            component: () => import('@/pages/InquiryPage.vue')
        },
        {
            path: '/inquiry/:id',
            component: () => import('@/components/inquiry/InquiryDetailPage.vue')
        },   
        
    ]
})

export default router