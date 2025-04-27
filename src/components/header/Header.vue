<template>
    <header class="main-header">
        <div class="inner-header">
            <div class="header-left">
            <img src="@/assets/images/logo.png" alt="로고" class="logo-img" />
            </div>
            <div class="header-center">
            
            </div>
            <div class="header-right">
            <img src="@/assets/icons/dm-icon.svg" alt="DM" class="header-icon dm" />
            <img src="@/assets/icons/search-icon.svg" alt="검색" class="header-icon search" />
            <img src="@/assets/icons/alert-icon.svg" alt="알림" class="header-icon alert" />
            <div class="profile-info">
                <span class="profile-nickname">삥삥이</span>
                <span class="logout">
                <img src="@/assets/icons/logout-icon.svg" alt="로그아웃" class="logout-icon"/>로그아웃</span>
            </div>
            <img src="@/assets/images/header-profile.png" alt="프로필" class="profile-img" />
            </div>
        </div>
    </header>
</template>

<script setup>
</script>

<style scoped>
    .main-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        min-width: 1024px;
        height: 66px;
        background: #FFFFFF;
        border-bottom: 1px solid #cdcdcd;
        z-index: 100;
        display: flex;
        justify-content: center; /* 중앙 정렬 */
    }

    .inner-header {
        width: 100%;
        max-width: 1440px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        box-sizing: border-box;
    }

    .header-left {
        display: flex;
        align-items: center;
    }
    .logo-img {
        width: 70px;
        height: auto;
        margin-right: 12px;
    }

    .header-icon {
        width: 28px;
        height: 28px;
        cursor: pointer;
        transition: filter 0.2s;
    }
    .header-icon:hover {
        filter: brightness(0.7);
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 14px;
    }
    .profile-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-right: 8px;
    }
    .profile-nickname {
        font-size: 15px;
        font-weight: 600;
        color: #000000;
        letter-spacing: -0.5px;
        line-height: 18px;
    }
    .logout {
        font-size: 12px;
        color: #6F6F6F;
        margin-top: 2px;
        display: flex;
        align-items: center;
        gap: 3px;
        cursor: pointer;
    }
    .logout:hover {
        text-decoration: underline;
    }
    .profile-img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
        border: 1.5px solid #cdcdcd;
    }
</style>
