<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="modal-overlay"
      @click.self="handleClose"
    >
      <div class="modal-content">
        <h2>할 일을 입력하세요</h2>

        <!-- Todo 내용 입력 -->
        <input
          v-model="content"
          type="text"
          placeholder="할 일 내용을 입력하세요"
        />

        <!-- 카테고리 선택: 목업 데이터 categories 사용 -->
        <select v-model.number="categoryId">
          <option :value="null">카테고리 선택 안함</option>
          <option
            v-for="cat in categories"
            :key="cat.personal_category_num"
            :value="cat.personal_category_num"
          >
            {{ cat.name }}
          </option>
        </select>

        <!-- 모드 선택 버튼 -->
        <div class="mode-buttons">
          <button :class="{ active: mode === '일반' }" @click="mode = '일반'">일반</button>
          <button :class="{ active: mode === '반복' }" @click="mode = '반복'">반복</button>
          <button :class="{ active: mode === '다중' }" @click="mode = '다중'">다중</button>
        </div>

        <!-- 일반 모드: 네이티브 Date Picker -->
        <div v-if="mode === '일반'" class="date-picker">
          <input
            type="date"
            v-model="selectedDate"
            class="date-input"
          />
        </div>

        <!-- 취소 / 확인 버튼 -->
        <div class="modal-actions">
          <button class="btn-cancel" @click="handleClose">
            취소
          </button>
          <button class="btn-confirm" @click="handleConfirm">
            확인
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, required: true },
  categories: { type: Array, default: () => [] },
  defaultDate: { type: String, default: '' }
})
const emit = defineEmits(['add', 'close'])

// 내부 폼 상태
const content = ref('')
const categoryId = ref(null)
const mode = ref('')
const selectedDate = ref(props.defaultDate)

// 모달(open) 될 때마다 초기화
watch(
  () => props.visible,
  (open) => {
    if (open) resetForm()
  }
)

function handleClose() {
  emit('close')
}

function handleConfirm() {
  if (!content.value) {
    alert('내용을 입력해주세요.')
    return
  }
  // 목업 데이터 구조에 맞춰 payload 생성
  const payload = {
    content: content.value,
    personal_category_num: categoryId.value,
    client_num: null,
    date: selectedDate.value
  }
  // 선택된 category가 있으면 client_num 포함
  if (categoryId.value !== null) {
    const cat = props.categories.find(c => c.personal_category_num === categoryId.value)
    payload.client_num = cat ? cat.client_num : null
  }
  emit('add', payload)
  emit('close')
}

function resetForm() {
  content.value = ''
  categoryId.value = null
  mode.value = ''
  selectedDate.value = props.defaultDate
}
</script>

<style scoped>
/* 모드 버튼 스타일 */
.mode-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.mode-buttons button {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f8f8f8;
  cursor: pointer;
}
.mode-buttons button.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

/* 네이티브 date input 스타일 */
.date-picker {
  margin-bottom: 16px;
}
.date-input {
  width: 95%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-content h2 {
  margin: 0;
  font-size: 1.25rem;
  text-align: center;
}
.modal-content input{
	width: 95%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}
.modal-content select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
.btn-cancel {
  background: #f0f0f0;
  color: #333;
}
.btn-confirm {
  background: #000;
  color: #fff;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
