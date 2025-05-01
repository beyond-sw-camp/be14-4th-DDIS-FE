<template>
  <div v-if="modelValue" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <button class="close-button" @click="closeModal">&times;</button>
        <h2>모집게시글 작성</h2>
      </div>

      <div class="modal-body">
        <!-- 1단계: 제목/내용 입력 -->
        <div class="form-section" :class="{ fade: showDetail }">
          <div class="form-group">
            <label>카테고리</label>
            <select v-model="formData.category">
              <option value="">카테고리 선택</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>제목</label>
            <input 
              type="text" 
              v-model="formData.title"
              placeholder="제목을 입력하세요."
            >
          </div>

          <div class="form-group">
            <label for="content">내용</label>
            <div class="content-container">
              <div class="content-guide">
                <pre class="guide-format">
[TO-DO 소개]
소개 내용을 작성하세요.

[TO-DO 리스트]
• 할 일 1
• 할 일 2
• 할 일 3

[인증 방법]
인증 방법을 작성하세요.</pre>
                <p>위 형식에 맞춰 작성해주세요.</p>
              </div>
              <textarea 
                id="content" 
                v-model="formData.content" 
                required
                class="form-textarea content-input"
                rows="15"
                placeholder="내용을 입력하세요."
              ></textarea>
            </div>
          </div>
        </div>
        <!-- 2단계: 상세 설정 (애니메이션 전환 포함) -->
        <transition name="fade">
          <PostDetailSettings
            v-if="showDetail"
            v-model="showDetail"
            @submit="handleDetailSubmit"
          />
        </transition>
      </div>

      <div class="modal-footer">
        <div class="button-group">
          <button class="cancel-btn" @click="closeModal">나가기</button>
          <button v-if="!showDetail" class="next-btn" @click="showDetail = true">다음</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PostDetailSettings from '@/components/post/PostDetailSetting.vue'


const props = defineProps<{
  modelValue: boolean
  categories: string[]
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const showDetail = ref(false)

const formData = ref({
  category: '',
  title: '',
  content: ''
})

const closeModal = () => {
  emit('update:modelValue', false)
  showDetail.value = false
  formData.value = {
    category: '',
    title: '',
    content: ''
  }
}

const handleDetailSubmit = (detailData: any) => {
  if (!formData.value.category || !formData.value.title || !formData.value.content) {
    alert('모든 필드를 입력해주세요.')
    return
  }

  emit('submit', { 
    ...formData.value,
    ...detailData
  })
  closeModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  min-height: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative; /* ✅ 상세 설정의 기준 */
}

.modal-header {
  position: relative;
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.close-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  color: #666;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  position: relative; /* ✅ PostDetailSettings 겹치기 위해 */
  min-height: 400px;
}

.form-section {
  transition: opacity 0.3s ease;
  opacity: 1;
}

.form-section.fade {
  opacity: 0.3;
  pointer-events: none;
}

.form-group {
  margin-bottom: 24px;
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  background-color: white;
  color: #333;
}

.form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.modal-footer {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn,
.next-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.cancel-btn {
  background-color: #e0e0e0;
}

.cancel-btn:hover {
  background-color: #ccc;
}

.next-btn {
  background-color: #666;
  color: white;
}

.next-btn:hover {
  background-color: #333;
}

/* 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.content-container {
  max-width: 600px;
  margin: 0 auto;
}

.content-guide {
  margin-bottom: 12px;
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  width: 100%;
}

.guide-format {
  font-family: monospace;
  white-space: pre;
  line-height: 1.5;
  margin: 0 0 12px 0;
  color: #495057;
}

.content-guide p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.content-input {
  font-family: monospace;
  white-space: pre-wrap;
  line-height: 1.5;
  padding: 16px;
}

.form-textarea {
  width: 100%;
  display: block;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  resize: vertical;
  min-height: 300px;
  background-color: white;
}

.form-textarea:focus,
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #666;
  box-shadow: 0 0 0 2px rgba(102, 102, 102, 0.1);
}
</style>
