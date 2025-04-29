<template>
    <div class="follow-box">
      <img :src="image" alt="프로필 이미지" class="profile-img" />
      <span class="nickname">{{ nickname }}</span>
    </div>
  </template>
  
  <script setup>
  defineProps({
    image: String,
    nickname: String
  });
  </script>
  
  <style scoped>
  .follow-box {
    width: 497px;
    height: 117px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 0 24px;
  }
  
  .profile-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 24px;
  }
  
  .nickname {
    font-size: 25px;
    font-weight: bold;
  }
  </style>
  