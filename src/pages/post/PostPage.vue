<template>
  <div class="board-container">
    <div class="board-header">
      <div class="left-section">
        <h1 class="board-title">모집 게시판</h1>
        <div class="category-tabs">
          <button 
            v-for="category in categories" 
            :key="category"
            class="tab"
            :class="{ active: selectedCategory === category }"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>
      <div class="right-section">
        <input type="search" v-model="searchKeyword" placeholder="검색어를 입력하세요" class="search-input" />
        <select v-model="sortOption" class="sort-select">
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>
    </div>

    <!-- 게시글 목록 -->
    <table class="board-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>카테고리</th>
          <th>제목</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedFilteredItems" 
            :key="item.id"
            @click="navigateToDetail(item.id)">
          <td>{{ item.id }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <div class="pagination">
        <!-- 맨 처음 페이지 이동 -->
        <button class="arrow" @click="goFirst">
            <img src="@/assets/icons/double-left-icon.svg" alt="맨 처음" />
        </button>
        <!-- 이전 페이지 이동 -->
        <button class="arrow" @click="goPrev">
            <img src="@/assets/icons/left-icon.svg" alt="이전" />
        </button>
        <!-- 페이지 번호들 -->
        <div class="page-numbers">
            <button
                v-for="page in totalPages"
                :key="page"
                :class="['page-button', { active: page === currentPage }]"
                @click="movePage(page)">
                {{ page }}
            </button>
        </div>
        <!-- 다음 페이지 이동 -->
        <button class="arrow" @click="goNext">
            <img src="@/assets/icons/right-icon.svg" alt="다음" />
        </button>
        <!-- 맨 마지막 페이지 이동 -->
        <button class="arrow" @click="goLast">
            <img src="@/assets/icons/double-right-icon.svg" alt="맨 마지막" />
        </button>
    </div>

    <!-- 등록 버튼 -->
    <button class="register-btn" @click="showModal = true">등록</button>

    <!-- 모달 컴포넌트 -->
    <PostModal 
      v-model="showModal"
      :categories="categories.filter(c => c !== '전체')"
      @submit="handlePostSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'  
import PostModal from '@/components/post/PostModal.vue'
import { useRouter } from 'vue-router'

interface BoardItem {
  id: number
  category: string
  title: string
  status: string
  startDate: Date
  endDate: Date
  participateDuration: number
  maxParticipants: number
}

const router = useRouter()

const items = ref<BoardItem[]>([])
const showModal = ref(false)
const pageSize = 8;
const currentPage = ref(1);

const categories = ['전체', '일상', '건강', '자기개발', '학습', '문화']
const selectedCategory = ref('전체')
const searchKeyword = ref('')
const sortOption = ref('latest')

const getStatus = (startDate: Date, endDate: Date) => {
  const now = new Date()
  if (now < startDate) return '모집예정'
  if (now > endDate) return '모집마감'
  return '모집중'
}

const filteredItems = computed(() => {
  let list = [...items.value]

  if (selectedCategory.value !== '전체') {
    list = list.filter(item => item.category === selectedCategory.value)
  }

  if (searchKeyword.value.trim() !== '') {
    list = list.filter(item => item.title.includes(searchKeyword.value))
  }

  if (sortOption.value === 'latest') {
    list.sort((a, b) => b.id - a.id)
  } else {
    list.sort((a, b) => a.id - b.id)
  }

  return list.map(item => ({
    ...item,
    status: getStatus(item.startDate, item.endDate)
  }))
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / pageSize));

const paginatedFilteredItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredItems.value.slice(start, end);
});

function movePage(page) {
    currentPage.value = page;
}

function goFirst() {
    if (currentPage.value !== 1) {
        currentPage.value = 1;
    }
}

function goPrev() {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
}

function goNext() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
}

function goLast() {
    if (currentPage.value !== totalPages.value) {
        currentPage.value = totalPages.value;
    }
}

onMounted(() => {
  const now = new Date()
  items.value = [
    { 
      id: 8, 
      category: '일상', 
      title: '매일 감사일기 쓰실 분 모집합니다.', 
      status: '모집중',
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7일 전
      endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7일 후
      participateDuration: 14,
      maxParticipants: 10
    },
    { 
      id: 7, 
      category: '학습', 
      title: '같이 피그마 매일 복습하실 분 구합니다.', 
      status: '모집중',
      startDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3일 전
      endDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4일 후
      participateDuration: 7,
      maxParticipants: 5
    },
    { 
      id: 6, 
      category: '학습', 
      title: '매일 백준 알고리즘 1문제씩 푸실 분 모집해요.', 
      status: '모집중',
      startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1일 전
      endDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6일 후
      participateDuration: 7,
      maxParticipants: 10
    },
    { 
      id: 5, 
      category: '건강', 
      title: '주 3회 운동하실 분 구합니다.', 
      status: '모집마감',
      startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14일 전
      endDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1일 전
      participateDuration: 14,
      maxParticipants: 10
    },
    { 
      id: 4, 
      category: '문화', 
      title: '같이 매일 독서 하실 분 찾습니다.', 
      status: '모집마감',
      startDate: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), // 21일 전
      endDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7일 전
      participateDuration: 28,
      maxParticipants: 10
    },
    { 
      id: 3, 
      category: '문화', 
      title: '한달에 책 3권 읽는 것을 목표로 달려보실 분 찾습니다.', 
      status: '모집마감',
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30일 전
      endDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15일 전
      participateDuration: 30,
      maxParticipants: 10
    },
    { 
      id: 2, 
      category: '자기개발', 
      title: '한달동안 저축 습관 만들어보실 분 모집합니다.', 
      status: '모집마감',
      startDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), // 45일 전
      endDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15일 전
      participateDuration: 45,
      maxParticipants: 10
    },
    { 
      id: 1, 
      category: '건강', 
      title: '매일 포케, 샐러드 1식 하실 분 구합니다.', 
      status: '모집마감',
      startDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // 60일 전
      endDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30일 전
      participateDuration: 60,
      maxParticipants: 10
    }
  ]
})

const handlePostSubmit = (formData: { 
  category: string; 
  title: string; 
  content: string;
  recruitDuration: number;
  participateDuration: number;
  maxParticipants: number;
}) => {
  const now = new Date()
  // 새 게시글 추가
  const newPost: BoardItem = {
    id: Math.max(...items.value.map(item => item.id)) + 1,
    category: formData.category,
    title: formData.title,
    status: '모집중',
    startDate: now,
    endDate: new Date(now.getTime() + formData.recruitDuration * 24 * 60 * 60 * 1000),
    participateDuration: formData.participateDuration,
    maxParticipants: formData.maxParticipants
  }
  
  items.value.unshift(newPost)
}

const navigateToDetail = (itemId: number) => {
  router.push(`/posts/detail/${itemId}`)
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
  color: #50D4C6;
}

.tab.active {
  color: #50D4C6;
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
  margin-bottom: 20px;
}

.board-table th,
.board-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.board-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.board-table tbody tr {
  cursor: pointer;
  transition: color 0.2s ease;
}

.board-table tbody tr:hover {
  color: #50D4C6;
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
