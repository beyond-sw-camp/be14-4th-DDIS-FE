<template>
  <div class="page-wrapper">
    <!-- 좌측 사이드바 -->
    <div class="left-sidebar">
      <RoomLeftSideBar
        :title="room.title"
        :content="room.content"
      />
    </div>

    <!-- 중앙 달력 -->
    <div class="calendar-center">
      <Calendar />
    </div>

    <!-- 우측 사이드바 -->
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
import { ref, watch } from 'vue'
import Calendar from '@/components/calendar/Calendar.vue'
import RoomLeftSideBar from '@/components/sidebar/RoomLeftSideBar.vue'
import RoomRightSideBar from '@/components/sidebar/RoomRightSideBar.vue'
import ApproveModal from '@/components/modal/ApproveModal.vue'

const props = defineProps({
  room: {
    type: Object,
    required: true
  }
})

const showModal = ref(false)
const todoList = ref([])
const approveList = ref([])

// ✅ room이 들어올 때마다 fetch 실행
watch(
  () => props.room,
  async (room) => {
    if (!room || !room.roomNum) return

    try {
      const res = await fetch(`http://localhost:8080/room/${room.roomNum}/data`)
      const data = await res.json()
      todoList.value = data.todoList
      approveList.value = data.approveList
    } catch (err) {
      console.error('room 데이터 fetch 실패:', err)
    }
  },
  { immediate: true }
)

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function removeApprove(id) {
  approveList.value = approveList.value.filter(approve => approve.id !== id)
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
