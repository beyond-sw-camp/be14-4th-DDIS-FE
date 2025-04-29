<template>
  <div class="right-sidebar">
    <button class="share-todo-button">
      📍 ShareTODO
    </button>

    <!-- 공유 TODO 리스트 -->
    <draggable
  :list="todoList"
  tag="ul"
  handle=".drag-handle"
  animation="200"
  class="todo-list"
  item-key="shareTodoNum"
>
  <template #item="{ element }">
    <li>
      <span class="drag-handle">⠿</span> {{ element.shareTodoName }}
    </li>
  </template>
</draggable>


    <button class="approve-button" @click="openModal">
      ✔️ Approve
    </button>

    <div class="approve-list">
      <div v-for="approve in approveList" :key="approve.id" class="approve-box">
        <p class="approve-title">요청: {{ approve.title }}</p>
        <p class="approve-content">{{ approve.content }}</p>
        <div class="approve-actions">
          <button class="approve-yes" @click="approveItem(approve.id)">✔️</button>
          <button class="approve-no" @click="rejectItem(approve.id)">❌</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  todoList: {
    type: Array,
    required: true
  },
  approveList: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['open-approve-modal', 'approve-success', 'approve-reject'])

function openModal() {
  emit('open-approve-modal')
}

function approveItem(id) {
  emit('approve-success', id)
}

function rejectItem(id) {
  emit('approve-reject', id)
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
