<template>
    <div class="main">
        <h1>메인 페이지입니다</h1>
        <div class="center-box">
            <img :src="logo" alt="로고" class="logo" />
        </div>
    </div>
</template>

<script setup>
    import logo from '@/assets/images/logo.png'
</script>

<style scoped>
    .main {
        text-align: center;
        margin-top: 100px;
    }

    .center-box {
        display: flex;
        justify-content: center; /* 가로 중앙 */
        align-items: center;     /* 세로 중앙 */
        height: 100vh;
    }
    .center-box img {
        /* max-width: 100vw;
        max-height: 80vh;
        width: auto;
        height: auto;
        object-fit: contain; */
        width: 50vw;
        height: auto;
        max-height: 80vh;
        object-fit: contain;
    }

</style>