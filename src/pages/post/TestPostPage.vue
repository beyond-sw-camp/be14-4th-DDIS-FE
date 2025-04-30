<!-- 백엔드 연동중인 페이지 -->

<template>
  <div class="board-container">
    <div class="board-header">
      <div class="left-section">
        <h1 class="board-title">모집 게시판</h1>
        <div class="category-tabs">
          <button v-for="category in categories" :key="category" class="tab" :class="{ active: selectedCategory === category }" @click="selectedCategory = category">
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
        <tr v-for="item in paginatedFilteredItems" :key="item.id" @click="goToDetail(item.id)" style="cursor: pointer">
          <td>{{ item.id }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>

    <Pagenation
      v-if="totalPages > 1"
      :total-pages="totalPages"
      :current-page="currentPage"
      @change="movePage"
    />

    <button class="register-btn" @click="showModal = true">등록</button>

    <PostModal v-model="showModal" :categories="categories.filter(c => c !== '전체')" />
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PostModal from '@/components/post/PostModal.vue'
import Pagenation from '@/components/pagenation/Pagenation.vue'

interface PostItem {
  id: number
  category: string
  title: string
  is_closed: boolean
  startDate: string
  endDate: string
  status?: string
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:8080/posts/public')
    if (!res.ok) throw new Error('게시글 목록 조회 실패')
    const data = await res.json()

    // snake_case → camelCase로 변환해서 PostItem 배열에 맞게 매핑
    items.value = data.map((item: any): PostItem => ({
      id: item.post_num,
      category: item.category_name,
      title: item.post_title,
      is_closed: item.is_closed ?? false,
      startDate: item.recruitment_start_date,
      endDate: item.recruitment_end_date
    }))
  } catch (e) {
    console.error('❌ 데이터 불러오기 실패:', e)
  }
})

const router = useRouter()
const items = ref<PostItem[]>([])
const showModal = ref(false)
const pageSize = 8
const currentPage = ref(1)

const categories = ['전체', '일상', '건강', '자기개발', '학습', '문화']
const selectedCategory = ref('전체')
const searchKeyword = ref('')
const sortOption = ref('latest')

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
    status: item.is_closed ? '모집마감' : '모집중'
  }))
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / pageSize))

const paginatedFilteredItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredItems.value.slice(start, end)
})

function movePage(page: number) {
  currentPage.value = page
}

const goToDetail = (id: number) => {
  router.push(`/posts/${id}`)
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
