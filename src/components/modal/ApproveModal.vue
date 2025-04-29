<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Approve 등록</h2>
        
        <!-- todo 선택 -->
        <select v-model="selectedTodoId" class="modal-select">
          <option v-for="todo in todoList" :key="todo.id" :value="todo.id">
            {{ todo.text }}
          </option>
        </select>
  
        <!-- 제목 입력 -->
        <input
          v-model="approveTitle"
          type="text"
          placeholder="제목을 입력하세요."
          class="modal-input"
        />
  
        <!-- 내용 입력 -->
        <textarea
          v-model="approveContent"
          placeholder="내용을 입력하세요."
          class="modal-textarea"
        ></textarea>
  
        <!-- 등록 버튼 -->
        <button @click="submitApprove" class="modal-submit">
          등록
        </button>
  
        <!-- 모달 닫기 -->
        <button @click="closeModal" class="modal-close">
          닫기
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const showModal = ref(false)
  const todoList = ref([
    { id: 1, text: '아침 7시에 일어나기' },
    { id: 2, text: '하루에 30분 자격증 공부하기' }
  ])
  
  const selectedTodoId = ref(null)
  const approveTitle = ref('')
  const approveContent = ref('')
  
  // Approve 생성
  function submitApprove() {
    if (!selectedTodoId.value || !approveTitle.value || !approveContent.value) {
      alert('모든 항목을 입력하세요.')
      return
    }
  
    const requestBody = {
      memberShareTodoNum: selectedTodoId.value,
      approveTitle: approveTitle.value,
      approveContent: approveContent.value,
      approveTime: new Date().toISOString()  // 예시로 현재시간
    }
  
    console.log('보낼 데이터:', requestBody)
  
    // TODO: 나중에 fetch로 서버 POST 요청 연결 예정
  
    closeModal()
  }
  
  // 모달 닫기
  function closeModal() {
    showModal.value = false
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    width: 400px;
    background: #fff;
    padding: 24px;
    border-radius: 10px;
    text-align: center;
  }
  
  .modal-input,
  .modal-textarea,
  .modal-select {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
  
  .modal-submit {
    margin-top: 20px;
    width: 100%;
    padding: 12px;
    background: #36c5f0;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .modal-close {
    margin-top: 10px;
    background: transparent;
    color: #555;
    border: none;
    cursor: pointer;
  }
  </style>
  