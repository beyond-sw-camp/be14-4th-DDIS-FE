<template>
  <div class="page-wrapper">
    <div class="left-sidebar">
      <RoomLeftSideBar
        :title="room.title"
        :content="room.content"
      />
    </div>

    <div class="calendar-center">
      <Calendar
        :roomNum="room.roomNum"
        :clientNum="clientNum"
        @update-todo-approve="updateTodoApprove"
        v-model:focusedDate="focusedDate"
      />
    </div>

    <div class="right-sidebar">
      <RoomRightSideBar
        :todoList="todoList"
        :approveList="approveList"
        :memberNum="memberNum"
        @open-approve-modal="openModal"
        @approve-success="removeApprove"
        @approve-reject="removeApprove"
        @open-share-todo-modal="isShareTodoModalOpen = true"
      />
    </div>

    <ApproveModal
      v-if="showModal"
      :todoList="approveTodoList"
      :selectedDate="selectedDate"
      :memberNum="memberNum"
      :roomNum="room.roomNum"
      @close="closeModal"
      @refresh="handleRefresh"
    />

    <ShareTodoModal
      v-if="isShareTodoModalOpen"
      :roomNum="room.roomNum"
      :year="currentYear"
      :month="currentMonth"
      :selectedDate="selectedDate"
      @close="isShareTodoModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import Calendar from '@/components/calendar/Calendar.vue'
import RoomLeftSideBar from '@/components/sidebar/RoomLeftSideBar.vue'
import RoomRightSideBar from '@/components/sidebar/RoomRightSideBar.vue'
import ApproveModal from '@/components/modal/ApproveModal.vue'
import ShareTodoModal from '@/components/modal/ShareTodoModal.vue'

const props = defineProps({
  room: {
    type: Object,
    required: true
  },
  clientNum: {
    type: Number,
    required: true
  }
})

const showModal = ref(false)
const isShareTodoModalOpen = ref(false)

const todoList = ref([])
const approveList = ref([])
const approveTodoList = ref([])
const selectedDate = ref('')
const memberNum = ref('')

const focusedDate = ref(new Date())
const currentYear = computed(() => dayjs(focusedDate.value).year())
const currentMonth = computed(() => dayjs(focusedDate.value).month() + 1)

onMounted(async () => {
  try {
    const res1 = await fetch(`http://localhost:8080/members/find?roomNum=${props.room.roomNum}&clientNum=${props.clientNum}`)
    const data1 = await res1.json()
    memberNum.value = data1.memberNum

    const res = await fetch(`http://localhost:8080/room/${props.room.roomNum}/data`)
    if (!res.ok) throw new Error('방 초기 데이터 불러오기 실패')

    const data = await res.json()
    todoList.value = data.todoList
    approveList.value = data.approveList
  } catch (err) {
    console.error('초기 데이터 로딩 실패:', err)
  }
})

async function handleRefresh() {
  try {
    const res = await fetch(`http://localhost:8080/calendar/room/${props.room.roomNum}/todos?clientNum=${props.clientNum}&date=${selectedDate.value}`)
    const data = await res.json()

    const newTodoList = data.map(item => ({
      shareTodoNum: item.shareTodoNum,
      shareTodoName: item.shareTodoName,
      memberShareTodoNum: item.memberShareTodoNum
    }))

    const newApproveList = data
      .filter(item => item.approveNum !== null)
      .map(item => ({
        id: item.approveNum,
        title: item.approveTitle,
        content: item.approveContent,
        time: item.approveTime,
        permitCount: item.approvePermitCount,
        refuseCount: item.approveRefuseCount
      }))

    todoList.value = newTodoList
    approveList.value = newApproveList
    approveTodoList.value = newTodoList
  } catch (err) {
    console.error('상태 갱신 실패:', err)
  }
}

function openModal(newTodos = null) {
  if (newTodos) {
    approveTodoList.value = newTodos || [...todoList.value]
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  handleRefresh()
}

function removeApprove(id) {
  approveList.value = approveList.value.filter(approve => approve.id !== id)
}

function updateTodoApprove({ todoList: newTodos, approveList: newApproves, selectedDate: date }) {
  todoList.value = newTodos
  approveList.value = newApproves
  approveTodoList.value = newTodos
  selectedDate.value = date
}
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px;
  padding-top: 80px;
  gap: 40px;
}

.left-sidebar {
  width: 260px;
}

.calendar-center {
  width: 840px;
}

.right-sidebar {
  width: 260px;
}
</style>
