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
        :default-date="selectedDate"
        @add="handleAddTodo"
        @close="closeAddModal"
      />

      <TodoList
        :todos="unpinnedTodos"
        @update-pin="handleTogglePin"
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
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import Calendar from '@/components/calendar/PersonalCalendar.vue'
import TodoList from '@/components/calendar/TodoList.vue'
import PinnedTodoList from '@/components/calendar/PinnedTodoList.vue'
import TodoAddModal from '@/components/calendar/TodoAddModal.vue'

// 기본 설정
const API_BASE = 'http://localhost:8080'
const clientNum = 6

// 날짜 유틸
function pad(n) {
  return n.toString().padStart(2, '0')
}
function formatLocalDate(dateInput) {
  const d = new Date(dateInput)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
function getToday() {
  return formatLocalDate(new Date())
}

// 상태 관리
const dayCompletionRate = ref({})
const todoExistsDates = ref({})
const selectedDate = ref(getToday())
const allTodos = ref([])
const todosForDate = ref([])
const pinnedTodos = ref([])
const showAddModal = ref(false)

onMounted(async () => {
  try {
    const allRes = await axios.get(`${API_BASE}/personal-todos/${clientNum}`)
    allTodos.value = allRes.data.map(item => ({
      ...item,
      todoDate: formatLocalDate(item.todoDate)
    }))
    updateCalendarState()
    await loadTodosForDate(selectedDate.value)
    await loadPinnedTodos()

  } catch (e) {
    console.error(e)
  }
})

watch(selectedDate, date => loadTodosForDate(date))


// watch(todosForDate, list => {
//   pinnedTodos.value = list
//     .filter(t => t.pinOrder > 0)
//     .sort((a, b) => a.pinOrder - b.pinOrder)
// }, { immediate: true })

async function loadTodosForDate(date) {
  const { data: mappings } = await axios.get(
    `${API_BASE}/personal-todos/${clientNum}/date`,
    { params: { todoDate: date } }
  )

  const todosMap = Object.fromEntries(
    allTodos.value.map(t => [String(t.todoNum), t])
  )

  todosForDate.value = mappings.filter(m => {
    const base = todosMap[String(m.todoNum)]
    return base?.todoContent || m.todoContent
  })
  .map(m => {
    const base = todosMap[String(m.todoNum)] || {}
    return {
      todoNum:             m.todoNum,
      todoDate:            formatLocalDate(m.todoDate),
      content:             base?.todoContent ?? m.todoContent ?? '(내용 없음)',
      personalCategoryNum: base?.personalCategoryNum ?? m.personalCategoryNum ?? -1,
      isDone:              m.isDone,
      isPublic:            m.isPublic,
      pinOrder:            m.pinOrder,
      categoryName:        base?.personalCategoryName ?? m.personalCategoryName ?? '일반',
      categoryColor:       base?.personalCategoryColorRgb ?? m.personalCategoryColorRgb ?? '#ccc'
    }
  })
}

function updateCalendarState() {
  const rate = {}, exist = {}
  allTodos.value.forEach(item => {
    exist[item.todoDate] = true
    rate[item.todoDate] = rate[item.todoDate] || { total: 0, done: 0 }
    rate[item.todoDate].total++
    if (item.isDone) rate[item.todoDate].done++
  })
  Object.entries(rate).forEach(([d, { total, done }]) => {
    rate[d] = done / total
  })
  dayCompletionRate.value = rate
  todoExistsDates.value = exist
}

function handleSelectDate(date) { selectedDate.value = date }
function openAddModal() { showAddModal.value = true }
function closeAddModal() { showAddModal.value = false }

async function handleAddTodo(payload) {
  try {
    console.log('[📤 보내는 payload]', payload)

    await axios.post(`${API_BASE}/personal-todos`, payload, {
      params: { clientNum }  // @RequestParam으로 받는 clientNum
    })

    const allRes = await axios.get(`${API_BASE}/personal-todos/${clientNum}`)
    allTodos.value = allRes.data.map(item => ({
      ...item,
      todoDate: formatLocalDate(item.todoDate)
    }))

    updateCalendarState()
    await loadPinnedTodos()
    await loadTodosForDate(selectedDate.value)
  } catch (e) {
    console.error('[❌ handleAddTodo 에러]', e)
  } finally {
    closeAddModal()
  }
}


async function handleToggleDone({ todoNum, todoDate, isDone }) {
  try {
    await axios.patch(
      `${API_BASE}/personal-todos`,
      { todoNum, existingTodoDate: todoDate, isDone },
      { params: { clientNum } }
    )
    const t = todosForDate.value.find(t => t.todoNum === todoNum && t.todoDate === todoDate)
    if (t) t.isDone = isDone

    const at = allTodos.value.find(t => t.todoNum === todoNum && t.todoDate === todoDate)
    if (at) at.isDone = isDone
     console.log('[🔄 allTodos 업데이트됨]', at.isDone)

    updateCalendarState()
  } catch (e) {
    console.error(e)
  }
}

async function handleTogglePublic({ todoNum, todoDate, isPublic }) {
  console.log('[📩 받은 toggle-public]', { todoNum, todoDate, isPublic }) // ✅ 확인

  try {
    await axios.patch(
      `${API_BASE}/personal-todos`,
      { todoNum, existingTodoDate: todoDate, isPublic },
      { params: { clientNum } }
    )

    console.log('[✅ PATCH 완료]', isPublic)

    const t = todosForDate.value.find(t => t.todoNum === todoNum && t.todoDate === todoDate)
    if (t){ t.isPublic = isPublic
      console.log('[🔄 todosForDate 업데이트됨]', t.isPublic)
    }
    const at = allTodos.value.find(t => t.todoNum === todoNum && t.todoDate === todoDate)
    if (at) at.isPublic = isPublic


    updateCalendarState()
  } catch (e) {
    console.error(e)
  }
}

async function handleDeleteTodo({ todoNum, todoDate }) {
  try {
    await axios.delete(
      `${API_BASE}/personal-todos`,
      { params: { clientNum, todoNum, todoDate } }
    )
    todosForDate.value = todosForDate.value.filter(
      t => !(t.todoNum === todoNum && t.todoDate === todoDate)
    )

    console.log('[✅ 삭제 완료] 현재 남은 todosForDate:', todosForDate.value)

    updateCalendarState()
    await loadPinnedTodos() 

  } catch (e) {
    console.error(e)
  }
}

async function handleUpdatePinOrder(newOrder) {
  if (!Array.isArray(newOrder)) {
  console.error('🛑 handleUpdatePinOrder: newOrder가 배열이 아닙니다:', newOrder)
  return
}

  try {
    for (let i = 0; i < newOrder.length; i++) {
      const t = newOrder[i]
      await axios.patch(
        `${API_BASE}/personal-todos`,
        { todoNum: t.todoNum, existingTodoDate: t.todoDate, pinOrderUpdate: i + 1 },
        { params: { clientNum } }
      )
    }
    pinnedTodos.value = newOrder.map((t, i) => ({ ...t, pinOrder: i + 1 }))
    updateCalendarState()
    await loadPinnedTodos() 
  } catch (e) {
    console.error(e)
  }
}
async function loadPinnedTodos() {
  const { data } = await axios.get(`${API_BASE}/personal-todos/${clientNum}/pinned`)
  pinnedTodos.value = data.map(item => ({
    ...item,
    todoNum: item.todoNum,
    content: item.todoContent,
    todoDate: formatLocalDate(item.todoDate),
    pinOrder: item.pinOrder ?? i + 1,
    categoryColor: item.personalCategoryColorRgb || '#ccc'  
  }))
}

async function handleTogglePin({ todoNum, todoDate }) {
  try {
    await axios.patch(`${API_BASE}/personal-todos`, {
      todoNum,
      existingTodoDate: todoDate,
      pinOrderUpdate: true
    }, {
      params: { clientNum }
    })

    await loadTodosForDate(selectedDate.value) // ✅ 현재 날짜의 목록 업데이트
    await loadPinnedTodos() // ✅ 전체 핀된 목록 다시 불러오기
  } catch (e) {
    console.error('📌 핀 고정 실패:', e)
  }
}

async function handleUnpinFromPinned(todo) {
  try {
    await axios.patch(
      `${API_BASE}/personal-todos`,
      { todoNum: todo.todoNum, existingTodoDate: todo.todoDate, pinOrderUpdate: 0 },
      { params: { clientNum } }
    )
    pinnedTodos.value = pinnedTodos.value.filter(
      t => !(t.todoNum === todo.todoNum && t.todoDate === todo.todoDate)
    )
    await loadPinnedTodos()
  } catch (e) {
    console.error('핀 해제 실패:', e)
  }
}

// const unpinnedTodos = computed(() =>
//   todosForDate.value.filter(t => t.pinOrder === 0)
// )

const unpinnedTodos = computed(() => todosForDate.value)
</script>



<style scoped>
/* 기존 스타일 그대로 유지 */
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
  max-width: 250px;
  min-width: 250px;
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
  user-select: none;
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
.follow-info b { color: #222; font-weight: 800 }
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
}
</style>
