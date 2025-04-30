<template>
  <div class="container">
    <!-- 왼쪽: 프로필 -->
    <div class="side-profile">
      <img src="/images/header-profile.png" alt="프로필" class="profile-img" />
      <div class="nickname">CANDDY</div>
      <div class="follow-info">
        <span>팔로워 <b>32</b></span>
        <span>팔로잉 <b>59</b></span>
      </div>
      <button class="follow-btn">팔로우</button>
    </div>

    <!-- 가운데: 캘린더 + 할 일 + 추가 모달 -->
    <div class="calendar-area">
      <Calendar
        :day-completion-rate="dayCompletionRate"
        :todo-exists-dates="todoExistsDates"
        :selected-date="selectedDate"
        @select-date="handleSelectDate"
      />

      <!-- 추가 버튼 -->
      <button class="add-todo-btn" @click="openAddModal">추가</button>

      <!-- 할 일 추가 모달 -->
      <TodoAddModal
        v-if="showAddModal"
        :visible="showAddModal" 
        :categories="categories"
        :default-date="selectedDate"
        @add="handleAddTodo"
        @close="closeAddModal"
      />

      <TodoList
        :todos="unpinnedTodos"
        @update-pin="handlePinCopy"
        @toggle-public="handleTogglePublic"
        @toggle-done="handleToggleDone"
        @delete="handleDeleteTodo"
      />
    </div>

    <!-- 오른쪽: 고정된 할 일 -->
    <div class="pinned-area">
      <h3 class="pinned-title">REMINDER</h3>
      <PinnedTodoList
        :todos="pinnedTodos"
        @toggle-done="handleToggleDone"
        @update-order="handleUpdatePinOrder"
        @update-pin="handleUnpinFromPinned"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Calendar from '@/components/calendar/PersonalCalendar.vue'
import TodoList from '@/components/calendar/TodoList.vue'
import PinnedTodoList from '@/components/calendar/PinnedTodoList.vue'
import TodoAddModal from '@/components/calendar/TodoAddModal.vue'

const API_BASE = 'http://localhost:3001'
const dayCompletionRate = ref({})
const todoExistsDates     = ref({})
const selectedDate        = ref(getToday())
const allTodos            = ref([])
const pinnedTodos         = ref([])
const categories          = ref([])
const showAddModal        = ref(false)

// 날짜 포맷 헬퍼
function getToday() {
  const today = new Date()
  return formatLocalDate(today)
}
function formatLocalDate(dateInput) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

onMounted(loadInitialData)
async function loadInitialData() {
  try {
    const [datesRes, todosRes, catsRes] = await Promise.all([
      axios.get(`${API_BASE}/todo_dates`),
      axios.get(`${API_BASE}/todos`),
      axios.get(`${API_BASE}/categories`)
    ])
    categories.value = catsRes.data
    mergeData(datesRes.data, todosRes.data)
  } catch (err) {
    console.error('데이터 로드 실패:', err)
  }
}

// todo_dates + todos + categories 머지
function mergeData(dates, todos) {
  const merged = dates.map(td => {
    const todo = todos.find(t => t.todo_num === td.todo_num) || {}
    const cat  = categories.value.find(c => 
      c.personal_category_num === todo.personal_category_num
    ) || {}
    return {
      ...td,
      content:        todo.content || '',
      category_color: cat.color   || '#ccc',
      category_name:  cat.name       || '기타'
    }
  })
  allTodos.value = merged
  updateCalendarState()
}

function updateCalendarState() {
  const rateMap = {}, existMap = {}
  allTodos.value.forEach(item => {
    const date = item.date
    rateMap[date] = rateMap[date] || { total:0, done:0 }
    rateMap[date].total++
    if (item.is_done) rateMap[date].done++
    existMap[date] = true
  })
  Object.keys(rateMap).forEach(d => {
    const {total, done} = rateMap[d]
    rateMap[d] = done/total
  })
  dayCompletionRate.value = rateMap
  todoExistsDates.value   = existMap
}

// 날짜 선택
function handleSelectDate(date) {
  selectedDate.value = date
}

const unpinnedTodos = computed(() =>
  allTodos.value.filter(t => t.date === selectedDate.value)
)

// 추가 모달 제어
function openAddModal() {
  showAddModal.value = true
}
function closeAddModal() {
  showAddModal.value = false
}

// 새 Todo 추가 핸들러
async function handleAddTodo({ content, personal_category_num, client_num, date }) {
  console.log('[Parent] payload →', { content, personal_category_num, client_num, date })

  // todos 테이블에
  const resT = await axios.post(`${API_BASE}/todos/`, {
    content,
    personal_category_num,
    client_num
  })

  const newId = resT.data.id
  
  await axios.patch(`${API_BASE}/todos/${newId}`, {
    todo_num: newId
  })


  const todoNum = newId
  // todo_dates 테이블에
  await axios.post(`${API_BASE}/todo_dates`, {
    todo_num: todoNum,
    date,           // 모달에서 넘어온 date
    is_done: false,
    is_public: false
  })


  await loadInitialData()
  closeAddModal()
}

// 핀 복사
function handlePinCopy(todo) {
  if (!pinnedTodos.value.find(t => t.id === todo.id)) {
    pinnedTodos.value.push({ ...todo, pin_order: Date.now() })
  }
}
// 핀 해제
function handleUnpinFromPinned(todo) {
  pinnedTodos.value = pinnedTodos.value.filter(t => t.id !== todo.id)
}

// 완료 / 공개 토글
async function handleToggleDone(todo) {
  todo.is_done = !todo.is_done
  await axios.patch(`${API_BASE}/todo_dates/${todo.id}`, { is_done: todo.is_done })
  updateCalendarState()
}
async function handleTogglePublic(todo) {
  todo.is_public = !todo.is_public
  await axios.patch(`${API_BASE}/todo_dates/${todo.id}`, { is_public: todo.is_public })
  updateCalendarState()
}

// 삭제
async function handleDeleteTodo(todo) {
  await axios.delete(`${API_BASE}/todo_dates/${todo.id}`)
  allTodos.value = allTodos.value.filter(t => t.id !== todo.id)
  pinnedTodos.value = pinnedTodos.value.filter(t => t.id !== todo.id)
  updateCalendarState()
}

// 핀 순서 업데이트
async function handleUpdatePinOrder(order) {
  for (let i=0; i<order.length; i++) {
    await axios.patch(`${API_BASE}/todo_dates/${order[i].id}`, { pin_order: i+1 })
  }
  pinnedTodos.value = [...order]
}
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  max-width: 1350px;
  margin: 200px auto 0;
  justify-content: space-between;
  gap: 40px;
  overflow-x: hidden; 
}

.calendar-area {
  flex: 2;
  min-width: 750px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.side-profile {
  flex: 1;
  min-width: 210px;
  max-width: 210px;
  background: #fff;
  border: 1.5px solid #ededed;
  border-radius: 18px;
  padding: 25px 20px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 10px 0 rgba(30,30,30,0.04);
}

.pinned-area {
  flex: 1;
  max-width: 210px;
  min-width: 210px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1.5px solid #ededed;
  border-radius: 18px;
  padding: 5px 10px 10px;
  box-shadow: 0 2px 10px 0 rgba(30,30,30,0.04);
}

.pinned-title {
  font-size: 20px;
  font-weight: 700;
  padding-top: 13px;
  padding-bottom: 13px;
  margin-bottom: 20px;
  text-align: center;
  color: #50D4C6;
  border: 2px solid #50D4C6;
  border-radius: 25px;
}

.profile-img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid #111;
  background: #fff;
  object-fit: cover;
  margin-bottom: 16px;
}

.nickname {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 1px;
  text-align: center;
}

.follow-info {
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
  display: flex;
  gap: 18px;
  justify-content: center;
}

.follow-info b { color: #222; font-weight: 800; }

.follow-btn {
  width: 100%;
  height: 36px;
  background: #111;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-top: 6px;
}

.add-todo-btn {
  align-self: flex-end;
  padding: 10px 20px;
  margin-right: 10px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 700;
  border: 1px solid transparent;

  font-size: 1.125rem;
}

.add-todo-btn:hover{
  border: 1px solid #111;
  background: #fff;
  box-shadow: 0 2px 10px 0 rgba(30,30,30,0.04);
  color: #000;
  /* height: 90%; */
}
</style>
