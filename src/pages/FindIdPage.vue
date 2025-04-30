<template>
    <div class="find-id-page">
      <h2>아이디 찾기</h2>
  
      <div class="form-section">
        <input
          v-model="form.email"
          type="email"
          placeholder="이메일 입력"
          @blur="validateEmail"
        />
        <button @click="sendVerificationCode" :disabled="errors.email">
          인증번호 전송
        </button>
        <div v-if="isCodeSent">
          <input v-model="form.code" type="text" placeholder="인증번호 입력" />
          <button @click="verifyCode">인증 확인</button>
          <span>{{ formattedTimer }}</span>
        </div>
      </div>
  
      <div v-if="isVerified" class="form-section">
        <input v-model="form.name" type="text" placeholder="이름 입력" />
        <button @click="findId">아이디 찾기</button>
      </div>
  
      <div v-if="foundId" class="result">
        <p>회원님의 아이디는 <strong>{{ foundId }}</strong>입니다.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const form = ref({
    email: '',
    code: '',
    name: ''
  })
  
  const errors = ref({ email: false })
  const isCodeSent = ref(false)
  const isVerified = ref(false)
  const foundId = ref('')
  const timer = ref(0)
  let timerInterval = null
  
  const formattedTimer = computed(() => {
    const min = Math.floor(timer.value / 60)
    const sec = String(timer.value % 60).padStart(2, '0')
    return `${min}:${sec}`
  })
  
  function validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    errors.value.email = !regex.test(form.value.email)
  }
  
  async function sendVerificationCode() {
    if (!form.value.email || errors.value.email) return
  
    try {
      const response = await fetch('http://localhost:8080/email/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.value.email })
      })
  
      if (!response.ok) throw new Error('인증번호 발송 실패')
      isCodeSent.value = true
      timer.value = 180
  
      if (timerInterval) clearInterval(timerInterval)
      timerInterval = setInterval(() => {
        if (timer.value > 0) timer.value--
        else {
          clearInterval(timerInterval)
          isCodeSent.value = false
        }
      }, 1000)
    } catch (err) {
      alert('인증번호 발송 실패')
    }
  }
  
  async function verifyCode() {
    try {
      const response = await fetch('http://localhost:8080/email/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.value.email, code: form.value.code })
      })
  
      if (!response.ok) throw new Error('인증 실패')
      isVerified.value = true
      alert('인증 완료')
    } catch (err) {
      alert('인증번호가 올바르지 않거나 시간이 초과되었습니다.')
    }
  }
  
  async function findId() {
    try {
      const response = await fetch('http://localhost:8080/clients/find-ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            clientEmail: form.value.email,
            clientName: form.value.name
        })
      });

      if (!response.ok) throw new Error('아이디 찾기 실패')
      const result = await response.json()
      foundId.value = result.clientId
    } catch (err) {
      alert('입력하신 정보와 일치하는 아이디가 없습니다.')
    }
  }
  </script>
  
  <style scoped>
  .find-id-page {
    max-width: 400px;
    margin: auto;
    padding: 20px;
  }
  
  .form-section {
    margin-top: 20px;
  }
  
  input {
    display: block;
    width: 100%;
    margin-bottom: 12px;
    padding: 10px;
    font-size: 14px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background: #50d4c6;
    border: none;
    color: white;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .result {
    margin-top: 20px;
    font-size: 16px;
    text-align: center;
  }
  </style>