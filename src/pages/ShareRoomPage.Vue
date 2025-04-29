<template>
    <div class="page-wrapper">
      <!-- 좌측 사이드바 -->
      <div class="left-sidebar">
        <RoomLeftSideBar/>
      </div>
  
      <!-- 가운데 달력 -->
      <div class="calendar-center">
        <Calendar></Calendar>
      </div>
  
      <!-- 우측 사이드바 -->
      <div class="right-sidebar">
        <RoomRightSideBar/>
      </div>
    </div>
  </template>
  
  <script setup>
  import Calendar from '@/components/calendar/Calendar.vue'
  import RoomLeftSideBar from '@/components/sidebar/RoomLeftSideBar.vue'
  import RoomRightSideBar from '@/components/sidebar/RoomRightSideBar.vue'
  </script>
  
  <style scoped>
  .page-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 48px;
    gap: 40px; /* 좌우 사이드바와 중앙 달력 간격 */
  }
  
  .left-sidebar {
    width: 260px;
  }
  
  .calendar-center {
    width: 840px;
  }
  
  .right-sidebar {
    width: 260px;
  }
  </style>
  