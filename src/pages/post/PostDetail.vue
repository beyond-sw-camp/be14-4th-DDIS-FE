<template>
  <div class="detail-page">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import TodoEditModal from '@/components/post/TodoEditModal.vue'

const router = useRouter()
const showEditModal = ref(false)

// Dummy data
const todoData = ref({
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
  createdAt: new Date(),
  startDate: new Date('2024-04-01'),
  endDate: new Date('2024-04-30'),
  recruitStartDate: new Date('2024-03-20'),
  recruitEndDate: new Date('2024-03-31'),
  currentParticipants: 3,
  maxParticipants: 10
})

// 현재 사용자가 작성자인지 확인 (임시로 false로 설정)
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
  todoData.value.title = data.title
  todoData.value.content = data.content
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
.todo-detail-page {
  min-height: calc(100vh - 60px);
  background-color: white;
  padding: 0 1rem;
  margin-top: 160px;
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.content-wrapper {
  padding: 2rem;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.category-tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #e9ecef;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
  word-break: keep-all;
  line-height: 1.4;
}

.meta-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.meta-info .divider {
  margin: 0 0.5rem;
}

/* Status Grid */
.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.status-item {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.status-item h3 {
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 0.5rem;
}

.status-item p {
  font-size: 1.1rem;
  color: #212529;
  font-weight: 500;
}

.highlight {
  color: #228be6;
  font-weight: 700;
}

/* Main Content */
.main-content {
  margin-bottom: 2rem;
}

.content-section {
  margin-bottom: 2rem;
}

.content-section h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.content-box {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
}

.content-text {
  color: #495057;
  line-height: 1.8;
  white-space: pre-line;
  font-size: 1rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.right-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #000000;
  color: white;
}

.btn-primary:hover {
  background-color: #dee2e6;
}

.btn-secondary {
  background-color: #000000;
  color: white;
}

.btn-secondary:hover {
  background-color: #dee2e6;
}

.btn-edit {
  background-color: #000000;
  color: white;
}

.btn-edit:hover {
  background-color: #dee2e6;
}

.btn-delete {
  background-color: #000000;
  color: white;
}

.btn-delete:hover {
  background-color: #dee2e6;
}

.btn-create {
  background-color: #000000;
  color: white;
}

.btn-create:hover {
  background-color: #dee2e6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .todo-detail-page {
    padding: 1rem;
  }

  .content-wrapper {
    padding: 1.5rem;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .right-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }

  .btn {
    width: 100%;
  }
}
</style> 