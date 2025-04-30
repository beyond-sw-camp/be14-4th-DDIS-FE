<template>
  <div class="pinned-wrapper">
    <!-- draggable: handle='.drag-handle' 지정 -->
    <draggable
      tag="div"
      :list="orderedTodos"
      item-key="id"
      handle=".drag-handle"
      @end="onDragEnd"
    >
      <template #item="{ element: todo, index }">
        <div class="pinned-item-wrapper" :key="todo.id">
          <!-- 스와이프 시 '핀 해제' 버튼 표시 -->
          <div
            v-if="swipedIndex === index"
            class="unpin-action"
            @click.stop="unpin(todo)"
          >
            핀 해제
          </div>

          <!-- 핀 고정 항목 컨테이너 -->
          <div class="pinned-item" :style="{ borderColor: todo.category_color }">
            <!-- 1) 스와이프 영역: 날짜와 텍스트만 처리 -->
            <div
              class="content-area"
              @mousedown.prevent="startSwipe($event, index)"
              @mousemove.prevent="trackSwipe($event, index)"
              @mouseup.prevent="endSwipe(index)"
              @mouseleave.prevent="resetSwipe(index)"
            >
              <div class="left-area">
                <!-- 스와이프 시 날짜 숨김 -->
                <div
                  v-if="swipedIndex !== index"
                  class="pinned-date"
                  :style="{ backgroundColor: todo.category_color }"
                >
                  {{ formatDate(todo.date) }}
                </div>
              </div>
              <!-- 텍스트만 소량 이동 -->
              <div
                class="middle-content"
                :style="swipedIndex === index ? { transform: 'translateX(12px)' } : {}"
              >
                {{ todo.content }}
              </div>
            </div>

            <!-- 2) 드래그 핸들: 순서 변경만 담당 -->
            <div class="drag-handle">≡</div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({ todos: Array })
const emit = defineEmits(['update-order', 'update-pin'])

// 내부 pinned 리스트 관리
const internalTodos = ref([])
watch(
  () => props.todos,
  newList => {
    internalTodos.value = newList
      .filter(t => t.pin_order > 0)
      .sort((a, b) => a.pin_order - b.pin_order)
  },
  { immediate: true, deep: true }
)
const orderedTodos = computed(() => internalTodos.value)

// 스와이프 상태 관리
const swipedIndex = ref(null)
const startX = ref({})
const isSwiping = ref({})
const SWIPE_THRESHOLD = 40

function startSwipe(e, idx) {
  startX.value[idx] = e.clientX
  isSwiping.value[idx] = true
}
function trackSwipe(e, idx) {
  if (!isSwiping.value[idx]) return
  const s = startX.value[idx]
  if (s == null) return
  const delta = e.clientX - s
  if (delta > SWIPE_THRESHOLD) swipedIndex.value = idx
  else if (delta < -SWIPE_THRESHOLD) swipedIndex.value = null
}
function endSwipe(idx) {
  startX.value[idx] = null
  isSwiping.value[idx] = false
}
function resetSwipe(idx) {
  startX.value[idx] = null
  isSwiping.value[idx] = false
  swipedIndex.value = null
}

// 핀 해제 이벤트 emit
function unpin(todo) {
  emit('update-pin', { ...todo, pin_order: 0 })
}

// 드래그 종료 후 pin_order 재설정 및 emit
function onDragEnd() {
  internalTodos.value.forEach((t, i) => { t.pin_order = i + 1 })
  emit('update-order', internalTodos.value)
}

// 날짜 포맷 'YYYY-MM-DD' -> 'MM/DD'
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${m}/${d}`
}
</script>

<style scoped>
.pinned-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}
.pinned-item-wrapper {
  position: relative;
  overflow: hidden;
  margin-bottom: 5px;

}

.unpin-action {
  position: absolute;
  left: 0;
  width: 80px;
  height: calc(100%);
  background: #ff4d4d;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  z-index: 2;
}

.pinned-item {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid;
  border-radius: 12px;
  overflow: hidden;
}

.content-area {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 12px;
  user-select: none;
  -webkit-user-drag: none;
}

.left-area {
  min-width: 48px;
  display: flex;
  justify-content: center;
}
.pinned-date {
  background: #ccc;
  padding: 4px 6px;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
}

.middle-content {
  flex: 1;
  color: #333;
  transition: transform 0.2s ease;
}

.drag-handle {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
}
</style>
