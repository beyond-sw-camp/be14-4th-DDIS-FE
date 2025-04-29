<template>
    <div class="right-sidebar">
      <!-- ShareTODO 버튼 -->
      <button class="share-todo-button">
        📍 ShareTODO
      </button>
  
      <!-- 공유 TODO 리스트 (드래그 가능) -->
      <draggable
  v-model="todoList"
  tag="ul"   
  handle=".drag-handle"
  animation="200"
  class="todo-list"
  item-key="id"
>
  <template #item="{ element }">
    <li>
      <span class="drag-handle">⠿{{ element.text }}</span>
    </li>
  </template>
</draggable>


  
      <!-- Approve 버튼 -->
      <button class="approve-button" @click="openModal">
      ✔️ Approve
      </button>
  
      <!-- Approve 요청 박스 목록 -->
      <div class="approve-list">
        <div v-for="approve in approveList" :key="approve.id" class="approve-box">
          <p class="approve-title">{{ approve.requesterName }} 님의 Approve</p>
          <div class="approve-actions">
            <button class="approve-yes" @click="handleApprove(approve.id)">✔️</button>
            <button class="approve-no" @click="handleReject(approve.id)">❌</button>
          </div>
        </div>
      </div>
      <ApproveModal v-if="showModal" @close="closeModal" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import draggable from 'vuedraggable'
  import ApproveModal from '@/components/modal/ApproveModal.vue' // 모달 컴포넌트 임포트
  
  const showModal = ref(false)
  // 가짜 TODO 리스트
  const todoList = ref([
  { id: 1, text: '아침 7시에 일어나기' },
  { id: 2, text: '하루에 30분 자격증 공부하기' }
])
  
  // 가짜 Approve 데이터
  const approveList = ref([
    { id: 1, requesterName: 'CANDDY' },
    { id: 2, requesterName: 'OKKZZI' }
  ])
  
  function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}
  // 드래그 끝날 때 호출
  function onDragEnd(event) {
    console.log('드래그 끝났다! 새로운 순서:', todoList.value)
    // TODO: 나중에 서버로 순서 저장 API 호출 가능
  }
  
  // 승인 버튼 클릭
  function handleApprove(id) {
    console.log(`ID ${id} 승인 완료`)
    approveList.value = approveList.value.filter(approve => approve.id !== id)
  }
  
  // 거절 버튼 클릭
  function handleReject(id) {
    console.log(`ID ${id} 거절 완료`)
    approveList.value = approveList.value.filter(approve => approve.id !== id)
  }
  </script>
  
  <style scoped>
  .right-sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .share-todo-button {
    width: 200px;
    padding: 10px;
    border: 2px solid #000;
    border-radius: 30px;
    background: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .todo-list {
    width: 200px;
    padding-left: 0;
    font-size: 14px;
    color: #333;
    margin: 0;
  }
  
  .todo-list li {
    margin: 6px 0;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: grab;
  }
  
  .drag-handle {
    cursor: move;
    font-size: 18px;
  }
  
  .approve-button {
    width: 200px;
    padding: 10px;
    border: 2px solid #000;
    border-radius: 30px;
    background: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .approve-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .approve-box {
    width: 200px;
    padding: 16px;
    border: 1px solid #aaa;
    border-radius: 12px;
    background: #f8f8f8;
  }
  
  .approve-title {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 12px;
    text-align: center;
  }
  
  .approve-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .approve-yes,
  .approve-no {
    width: 36px;
    height: 36px;
    font-size: 20px;
    background: white;
    border: 1px solid #aaa;
    border-radius: 50%;
    cursor: pointer;
  }
  </style>
  