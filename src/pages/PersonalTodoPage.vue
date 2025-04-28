<template>
    <header>
      <Header />
    </header>
    <div class="container">
      <div class="side-profile">
        <img src="@/assets/images/header-profile.png" alt="프로필" class="profile-img" />
        <div class="nickname">CANDDY</div>
        <div class="follow-info">
          <span>팔로워 <b>32</b></span>
          <span>팔로잉 <b>59</b></span>
        </div>
        <button class="follow-btn">팔로우</button>
      </div>
      <div class="calendar">
        <Calendar />
      </div>
    </div>
  </template>
  
  <script setup>
  import Calendar from '@/components/calendar/Calendar.vue'
  import Header from '@/components/header/Header.vue'
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 1440px;
    margin-top: 200px;
    justify-content: center;
    gap: 60px;
  }
  .calendar {
    /* 캘린더에 추가 스타일 있으면 여기에 */
  }
  .side-profile {
    width: 210px;
    background: #fff;
    border: 1.5px solid #ededed;
    border-radius: 18px;
    padding: 28px 20px 22px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2px 10px 0 rgba(30,30,30,0.04);
  }
  .profile-img {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 3px solid #111;
    background: #fff;
    object-fit: cover;
    margin-bottom: 16px;
  }
  .nickname {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 16px;
    letter-spacing: 1px;
    text-align: center;
  }
  .follow-info {
    font-size: 14px;
    color: #888;
    margin-bottom: 16px;
    display: flex;
    gap: 18px;
    justify-content: center;
  }
  .follow-info b {
    color: #222;
    font-weight: 800;
  }
  .follow-btn {
    width: 100%;
    height: 36px;
    background: #111;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.2s;
  }
  .follow-btn:hover {
    background: #222;
  }
  </style>
  