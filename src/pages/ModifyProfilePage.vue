<template>
    <div class="profile-edit-page">
      <h2 class="page-title">계정</h2>
      <div class="profile-section">
        <div class="nickname-row">
          <label>닉네임</label>
          <div class="nickname-input-wrapper">
            <input v-model="nickname" class="nickname-input" />
            <button class="edit-button">✎</button>
          </div>
        </div>
  
        <div class="info-row">
          <label>이메일</label>
          <div class="info-box">
            <span class="enable-text">{{ email }}</span>
            <button class="small-button">이메일 변경</button>
          </div>
        </div>
  
        <div class="info-row">
          <label>비밀번호</label>
          <div class="info-box">
            <span class="description">비밀번호 변경을 통해 계정 보안을 유지할 수 있습니다.</span>
            <button class="small-button">비밀번호 변경</button>
          </div>
        </div>
  
        <div class="info-row">
          <label>회원 탈퇴</label>
          <div class="info-box">
            <span class="description">탈퇴 후에는 복구가 불가능하며, 계정 정보 및 데이터는 모두 삭제됩니다.</span>
            <button class="danger-button">회원 탈퇴</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const nickname = ref('CANDDY')
  const email = ref('canddy@mail.com')
  </script>
  
  <style scoped>
  .profile-edit-page {
    max-width: 720px;
    margin: 100px auto;
    padding: 0 20px;
    font-family: sans-serif;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 32px;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
  }
  
  .profile-section {
    display: flex;
    flex-direction: column;
    gap: 28px;
    align-items: flex-start; /* 모든 요소를 왼쪽 정렬 */
  }


  
  .nickname-row label,
  .info-row label {
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 6px;
    display: block;
  }
  
  .nickname-input-wrapper,
  .info-box {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 내부 요소 간 균등한 간격 */
    width: 100%; /* 부모 요소 너비에 맞춤 */
   }

  
  .nickname-input {
    width: 240px;
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  
  .edit-button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
  
  .info-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .disabled-text {
    color: #888;
    font-size: 14px;
  }
  
  .description {
    color: #888;
    font-size: 13px;
    max-width: 400px;
  }
  
  .small-button {
    padding: 6px 12px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
  }
  
  .danger-button {
    padding: 6px 12px;
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
  }
  </style>