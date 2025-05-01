<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-box">
      <button class="close-btn" @click="emit('close')">×</button>
      <div class="category-sidebar">
        <div
          v-for="category in categories"
          :key="category.id"
          :style="{
            backgroundColor: category.colorRgba,
            border: selectedCategoryId === category.id ? '2px solid #000' : '2px solid transparent'
          }"
          class="category-item"
          @click="selectCategory(category)"
        >
          {{ category.name }}
        </div>
        <div class="category-add" @click="handleAddCategory">+</div>
      </div>

      <div class="category-content">
        <h2>카테고리 설정</h2>

        <div class="form-group">
          <label>카테고리명</label>
          <input v-model="categoryName" />
        </div>

        <div class="form-group">
          <label>카테고리 색상</label>
          <div class="color-palette">
            <div
              v-for="color in colorOptions"
              :key="color"
              class="color-circle"
              :class="{ selected: selectedColor === color }"
              :style="{ backgroundColor: colorRgbaMap[color] }"
              @click="() => handleColorSelect(color)"
            ></div>
          </div>
        </div>

        <div class="button-row">
          <button class="save-btn" @click="handleSave"> 저장 </button>
          <button class="delete-btn" @click="confirmDelete"> 삭제 </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="confirm-box">
      <p>정말 삭제하시겠습니까?</p>
      <p class="sub">해당 카테고리에 속한 투두를 어떻게 처리할지 선택하세요.</p>
      <div class="confirm-actions">
        <button class="danger" @click="deleteCategory('delete')">전체 삭제</button>
        <button @click="deleteCategory('detach')">투두 유지</button>
        <button class="cancel" @click="showDeleteConfirm = false">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from '@/utils/axios'

const emit = defineEmits(['close', 'refresh'])
const clientNum = 6

const categories = ref([])
const selectedCategoryId = ref(null)
const categoryName = ref('')
const selectedColor = ref('')
const showDeleteConfirm = ref(false)

const colorOptions = [
  'RED', 'ORANGE', 'LIGHT_GREEN', 'TURQUOISE', 'SKY_BLUE', 'PURPLE', 'VIOLET'
]

const colorRgbaMap = {
  RED: 'rgba(255, 140, 154, 1)',
  ORANGE: 'rgba(255, 170, 140, 1)',
  LIGHT_GREEN: 'rgba(197, 230, 149, 1)',
  TURQUOISE: 'rgba(80, 212, 198, 1)',
  SKY_BLUE: 'rgba(140, 194, 255, 1)',
  PURPLE: 'rgba(174, 140, 255, 1)',
  VIOLET: 'rgba(193, 132, 202, 1)'
}

onMounted(fetchCategories)

async function fetchCategories() {
  try {
    const { data } = await axios.get(`/personal-categories/${clientNum}`)
    categories.value = data.map(item => ({
      id: item.personalCategoryNum,
      name: item.personalCategoryName,
      color: getColorNameFromRgba(item.personalCategoryColorRgb),
      colorRgba: item.personalCategoryColorRgb
    }))
    await nextTick()
    if (categories.value.length) selectCategory(categories.value[0])
  } catch (err) {
    console.error('[❌ fetchCategories 에러]', err)
  }
}

function getColorNameFromRgba(rgba) {
  return Object.keys(colorRgbaMap).find(key => colorRgbaMap[key] === rgba) || 'TURQUOISE'
}

function selectCategory(category) {
  selectedCategoryId.value = category.id
  categoryName.value = category.name
  selectedColor.value = category.color
}

function handleColorSelect(color) {
  selectedColor.value = color
  const selected = categories.value.find(cat => cat.id === selectedCategoryId.value)
  if (selected) {
    selected.color = color
    selected.colorRgba = colorRgbaMap[color]
  }
}

async function handleSave() {
  try {
    await axios.patch(
      `/personal-categories/${selectedCategoryId.value}`,
      { name: categoryName.value, color: selectedColor.value },
      { params: { clientNum } }
    )
    await fetchCategories()
    emit('refresh')
    alert('카테고리 수정 완료!')
  } catch (e) {
    console.error(e)
    alert('수정 실패!')
  }
}

async function handleAddCategory() {
  try {
    await axios.post(`/personal-categories`, {
      name: `새 카테고리`,
      color: 'TURQUOISE'
    }, {
      params: { clientNum }
    })
    await fetchCategories()
  } catch (e) {
    alert('카테고리 추가 실패!')
  }
}

function confirmDelete() {
  showDeleteConfirm.value = true
}

async function deleteCategory(action) {
  try {
    await axios.delete(`/personal-categories/${selectedCategoryId.value}`, {
      params: { clientNum, action }
    })
    showDeleteConfirm.value = false
    await fetchCategories()
    if (categories.value.length) {
      selectCategory(categories.value[0])
    } else {
      selectedCategoryId.value = null
      categoryName.value = ''
      selectedColor.value = ''
    }
    emit('refresh')
  } catch (e) {
    console.error(e)
    alert('삭제 실패!')
  }
}
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  width: 700px;
  display: flex;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 22px;
  background: none;
  border: none;
  cursor: pointer;
}

.category-sidebar {
  width: 150px;
  background: #f8f8f8;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 340px;
  overflow-y: auto;
}

.category-item {
  padding: 8px;
  border-radius: 10px;
  color: #000;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  font-size: 13px;
}

.category-add {
  padding: 6px;
  background: #000;
  color: #fff;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s;
  font-size: 14px;
}

.category-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.color-palette {
	align-items: ;
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.color-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.color-circle.selected {
  border-color: #000;
  transform: scale(1.1);
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.save-btn,
.delete-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn {
  background: #000;
  color: #fff;
	border: 1px solid #eee;
}

.save-btn:hover {
  background: #fff;
  color: #000;
  border: 1px solid #000;
}

.delete-btn {
  background: #eee;
  color: #000;
}

.delete-btn:hover {
  background: #ff4d4d;
  color: #fff;
}

.confirm-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  text-align: center;
  z-index: 1100;
}

.confirm-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.confirm-actions button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.confirm-actions .danger {
  background: #ff4d4d;
  color: #fff;
}

.confirm-actions .cancel {
  background: #ccc;
  color: #000;
}

.sub {
  font-size: 13px;
  color: #666;
  margin-top: 6px;
}
</style>
