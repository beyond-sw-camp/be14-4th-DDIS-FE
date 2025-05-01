<!-- 백엔드 연동중인 페이지 미사용-->
<template>
  <div v-if="todoData" class="todo-detail-page">
    <div class="todo-detail-page">
      <div class="content-container">
        <div class="content-wrapper">
          <!-- Header Section -->
          <div class="header-section">
            <span class="category-tag">{{ todoData.category }}</span>
            <h1 class="title">{{ todoData.title }}</h1>
            <div class="meta-info">
              <span>작성자: {{ todoData.author }}</span>
              <span class="divider">|</span>
              <span>작성일: {{ formatDate(todoData.createdAt) }}</span>
            </div>
          </div>

          <!-- Status Grid -->
          <div class="status-grid">
            <div class="status-item">
              <h3>모집 상태</h3>
              <p>{{ statusLabel }}</p>
            </div>
            <div class="status-item">
              <h3>참여 기간</h3>
              <p>{{ formatDateRange(todoData.startDate, todoData.endDate) }}</p>
            </div>
            <div class="status-item">
              <h3>모집 기간</h3>
              <p>{{ formatDateRange(todoData.recruitStartDate, todoData.recruitEndDate) }}</p>
            </div>
            <div class="status-item">
              <h3>참여 현황</h3>
              <p>
                <span class="highlight">{{ todoData.currentParticipants }}</span> / 
                <span>{{ todoData.maxParticipants }}명</span>
              </p>
            </div>
          </div>  
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <section class="content-section">
            <h2>TO-DO 내용</h2>
            <div class="content-box">
              <div class="content-text">
                {{ todoData.content }}
              </div>
            </div>
          </section>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn btn-secondary" @click="goToList">목록으로</button>
          <div class="right-buttons">
            <template v-if="isAuthor">
              <button class="btn btn-edit" @click="handleEdit">수정</button>
              <button class="btn btn-delete" @click="handleDelete">삭제</button>
            </template>
            <template v-else>
              <button class="btn btn-primary" @click="handleApply">신청하기</button>
              <button class="btn btn-create" @click="handleCreateRoom">공동방 생성</button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <TodoEditModal
      v-if="showEditModal"
      :todo-data="{
        title: todoData.title,
        content: todoData.content
      }"
      @close="showEditModal = false"
      @submit="handleEditSubmit"
    />
    <span>{{ todoData.categoryNum }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import TodoEditModal from '@/components/post/TodoEditModal.vue'

// Define the Todo interface
interface Todo {
  id: number;
  category: string;
  title: string;
  content: string;
  author: string;
  authorId: number;
  createdAt: string | Date;
  startDate: string | Date;
  endDate: string | Date;
  recruitStartDate: string | Date;
  recruitEndDate: string | Date;
  currentParticipants: number;
  maxParticipants: number;
}

const router = useRouter()
const showEditModal = ref(false)

// Initialize with empty todo data
const todoData = ref<Todo>({
  id: 0,
  category: '',
  title: '',
  content: '',
  author: '',
  authorId: 0,
  createdAt: new Date(),
  startDate: new Date(),
  endDate: new Date(),
  recruitStartDate: new Date(),
  recruitEndDate: new Date(),
  currentParticipants: 0,
  maxParticipants: 0
})

// Function to set todo data from JSON
const setTodoData = (jsonData: any) => {
  const parsedData = {
    ...jsonData,
    createdAt: new Date(jsonData.createdAt),
    startDate: new Date(jsonData.startDate),
    endDate: new Date(jsonData.endDate),
    recruitStartDate: new Date(jsonData.recruitStartDate),
    recruitEndDate: new Date(jsonData.recruitEndDate)
  }
  todoData.value = parsedData as Todo
}

// Example usage with dummy JSON data
const dummyJsonData = {
  id: 1,
  category: '학습',
  title: '매일 영어 단어 5개씩 외우기',
  content: `[TO-DO 소개]
매일 아침 영어 단어 5개를 선정하여 하루종일 익히고 저녁에 복습하는 스터디입니다.

[TO-DO 리스트]
• 아침에 단어 5개 선정하기
• 선정한 단어로 예문 만들기
• 저녁에 복습하고 인증하기

[인증 방법]
매일 저녁 9시까지 오늘의 단어와 예문을 캡쳐하여 업로드해주세요.`,
  author: '영어왕',
  authorId: 1,
  createdAt: '2024-03-15T09:00:00Z',
  startDate: '2024-04-01T00:00:00Z',
  endDate: '2024-04-30T23:59:59Z',
  recruitStartDate: '2024-03-20T00:00:00Z',
  recruitEndDate: '2024-03-31T23:59:59Z',
  currentParticipants: 3,
  maxParticipants: 10
}

// Set initial data
setTodoData(dummyJsonData)

// 현재 사용자가 작성자인지 확인
const currentUserId = 1
const isAuthor = computed(() => todoData.value.authorId === currentUserId)

// Utility functions
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateRange = (start: Date, end: Date) => {
  const formatSimpleDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    })
  }
  return `${formatSimpleDate(start)} ~ ${formatSimpleDate(end)}`
}

// Event handlers
const goToList = () => {
  router.push('/posts')
}

const handleEdit = () => {
  showEditModal.value = true
}

const handleEditSubmit = (data: { title: string; content: string }) => {
  todoData.value = {
    ...todoData.value,
    title: data.title,
    content: data.content
  }
  showEditModal.value = false
}

const handleDelete = () => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    router.push('/posts')
  }
}

const handleApply = () => {
  console.log('Apply for todo')
}

const handleCreateRoom = () => {
  console.log('Create room')
}
</script>

<style scoped>
.board-container {
  padding: 120px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.left-section {
  width: 600px;
  margin: 0 auto;
  text-align: center;
  transform: translateX(140px); 
}

.board-title {
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.tab {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
}

.tab:hover {
  color: #007bff;
}

.tab.active {
  color: #007bff;
  font-weight: bold;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  width: 220px;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.board-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto 20px;
  text-align: center;
}

.board-table th,
.board-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.board-table th {
  border-bottom: 2px solid #ddd;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 40px;
}

.arrow {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}

.arrow img {
    width: 20px;
    height: 20px;
}

.page-numbers {
    display: flex;
    align-items: center;
    gap: 8px;
}

.page-button {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: transparent;
    border: none;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    color: #000;
}

.page-button.active {
    background-color: #000; 
    color: #fff;
}

.register-btn {
  padding: 8px 24px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  float: right;
  cursor: pointer;
}

.register-btn:hover {
  background-color: #333;
}
</style>