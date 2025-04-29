<template>
    <div class="calendar-wrapper">
      <VCalendar
        is-expanded
        :attributes="[]"
        title-position="center"
        hide-header
        class="custom-calendar"
        :week-start="1"
      >
        <template #day-content="{ day }">
          <div class="date-svg-cell" @click="selectDate(day)">
            <component
              :is="getStoneComponent(day.day)"
              :fill="getDayColor(day.day)"
              class="stone-svg"
            />
            <span
              class="date-text"
              :class="{
                sunday: day.weekday === 1,
                saturday: day.weekday === 7,
                selected: isSelected(day)
              }"
            >
              {{ day.day }}
            </span>
          </div>
        </template>
      </VCalendar>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Stone01 from '@/components/stone/Stone01.vue'
  import Stone02 from '@/components/stone/Stone02.vue'
  import Stone03 from '@/components/stone/Stone03.vue'
  import Stone04 from '@/components/stone/Stone04.vue'
  import Stone05 from '@/components/stone/Stone05.vue'
  
  const props = defineProps({
    roomNum: {
      type: Number,
      required: true
    },  clientNum: {
    type: Number,
    required: true
  }
  })
  
  const emit = defineEmits(['update-todo-approve'])
  
  const stoneComponents = [Stone01, Stone02, Stone03, Stone04, Stone05]
  const getStoneComponent = (day) => stoneComponents[(day - 1) % stoneComponents.length]
  
  const dayColorMap = {
    2: '#D6DBF7', 4: '#C2D0F7', 5: '#96B7F7', 7: '#4B77F7',
    8: '#C8C4F7', 11: '#6387F7', 12: '#3F4FF7', 14: '#7A8DF7',
    15: '#E2E5F7', 17: '#4860F7', 21: '#8D92F7', 22: '#E2E5F7',
    25: '#B9D6F7', 28: '#B2B7F7'
  }
  const getDayColor = (day) => dayColorMap[day] || '#F2F2F2'
  
  const selectedDate = ref(null)
  
  async function selectDate(day) {
    selectedDate.value = day.id
    try {
        const res = await fetch(`http://localhost:8080/calendar/room/${props.roomNum}/todos?clientNum=${props.clientNum}&date=${day.id}`)
      if (!res.ok) throw new Error('날짜별 todo 조회 실패')
  
      const data = await res.json()
  
      console.log('[🌟 서버 응답 데이터]', data)

      const newTodoList = data.map(item => ({
        shareTodoNum: item.shareTodoNum,
        shareTodoName: item.shareTodoName
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
  
      emit('update-todo-approve', { todoList: newTodoList, approveList: newApproveList })
    } catch (err) {
      console.error('날짜별 투두 로딩 실패:', err)
    }
  }
  
  function isSelected(day) {
    return selectedDate.value === day.id
  }
  </script>
  
  <style scoped>
  .calendar-wrapper {
    width: 720px;
    padding: 32px;
    border: 1px solid #CDCDCD;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  
  :deep(.custom-calendar .vc-weeks) {
    min-height: unset !important;
  }
  
  .date-svg-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 87px;
    height: 112px;
    margin: 4px;
    position: relative;
  }
  
  .stone-svg {
    width: 73px;
    height: 70px;
    margin-bottom: 2px;
  }
  
  .date-text {
    margin-top: 4px;
    font-size: 15px;
    font-weight: 500;
    color: #222 !important;
    z-index: 2;
    transition: all 0.12s;
  }
  
  .date-text.sunday {
    color: #FF1B1B !important;
    font-weight: 700 !important;
  }
  
  .date-text.saturday {
    color: #3A43FF !important;
    font-weight: 700 !important;
  }
  
  .date-text.selected {
    background: #111;
    color: #fff !important;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700 !important;
    font-size: 18px;
    margin: 0 auto;
  }
  
  :deep(.custom-calendar) {
    border: none !important;
    box-shadow: none !important;
    border-radius: 20px !important;
    background: #fff !important;
  }
  
  :deep(.custom-calendar .vc-pane-container),
  :deep(.custom-calendar .vc-pane-layout),
  :deep(.custom-calendar .vc-pane) {
    border: none !important;
    box-shadow: none !important;
    border-radius: 20px !important;
    background: #fff !important;
  }
  
  :deep(.custom-calendar .vc-weekdays) {
    border-top: 2px solid #CDCDCD !important;
    padding-top: 10px;
  }
  
  :deep(.custom-calendar .vc-weekdays .vc-weekday:nth-child(1)) {
    color: #FF1B1B !important;
    font-weight: 700 !important;
  }
  
  :deep(.custom-calendar .vc-weekdays .vc-weekday:nth-child(7)) {
    color: #3A43FF !important;
    font-weight: 700 !important;
  }
  
  :deep(.custom-calendar .vc-title) {
    font-size: 26px !important;
    font-weight: 800 !important;
    letter-spacing: -1px;
    color: #222;
  }
  </style>
  