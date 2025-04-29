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
      />
    </div>

    <div class="right-sidebar">
      <RoomRightSideBar
        :todoList="todoList"
        :approveList="approveList"
        @open-approve-modal="openModal"
        @approve-success="removeApprove"
        @approve-reject="removeApprove"
      />
    </div>

    <ApproveModal
      v-if="showModal"
      :todoList="todoList"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Calendar from '@/components/calendar/Calendar.vue'
import RoomLeftSideBar from '@/components/sidebar/RoomLeftSideBar.vue'
import RoomRightSideBar from '@/components/sidebar/RoomRightSideBar.vue'
import ApproveModal from '@/components/modal/ApproveModal.vue'

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
const todoList = ref([])
const approveList = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:8080/room/${props.room.roomNum}/data`)
    if (!res.ok) throw new Error('방 초기 데이터 불러오기 실패')

    const data = await res.json()

    todoList.value = data.todoList
    approveList.value = data.approveList
  } catch (err) {
    console.error('초기 데이터 로딩 실패:', err)
  }
})

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function removeApprove(id) {
  approveList.value = approveList.value.filter(approve => approve.id !== id)
}

// ✅ 여기 추가!
function updateTodoApprove({ todoList: newTodos, approveList: newApproves }) {
  todoList.value = newTodos
  approveList.value = newApproves
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