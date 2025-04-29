<template>
    <div class="calendar-wrapper">
        <VCalendar
        is-expanded
        :attributes="[]"
        title-position="center"
        hide-header
        class="custom-calendar"
        :week-start="1">
        <template #day-content="{ day }">
            <div class="date-svg-cell" @click="selectDate(day)">
                <component
                    :is="getStoneComponent(day.day)"
                    :fill="getDayColor(day.day)"
                    class="stone-svg"/>
                <span
                    class="date-text"
                    :class="{
                    sunday: day.weekday === 1,
                    saturday: day.weekday === 7,
                    selected: isSelected(day)
                    }">
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
    import SettingIcon from '@/assets/icons/setting-icon.svg'

    const stoneComponents = [Stone01, Stone02, Stone03, Stone04, Stone05]
    const getStoneComponent = (day) => stoneComponents[(day - 1) % stoneComponents.length]

    const dayColorMap = {
    2: '#D6DBF7',
    4: '#C2D0F7',
    5: '#96B7F7',
    7: '#4B77F7',
    8: '#C8C4F7',
    11: '#6387F7',
    12: '#3F4FF7',
    14: '#7A8DF7',
    15: '#E2E5F7',
    17: '#4860F7',
    21: '#8D92F7',
    22: '#E2E5F7',
    25: '#B9D6F7',
    28: '#B2B7F7',
    }
    const getDayColor = (day) => dayColorMap[day] || '#F2F2F2'

    // 날짜 클릭/선택 관련 로직
    const selectedDate = ref(null)
    function selectDate(day) {
    selectedDate.value = day.id   // day.id: "YYYY-MM-DD"
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
    /* 요일 헤더 색상 */
    :deep(.custom-calendar .vc-weekdays .vc-weekday:nth-child(1)) {
        color: #FF1B1B !important;
        font-weight: 700 !important;
    }
    :deep(.custom-calendar .vc-weekdays .vc-weekday:nth-child(7)) {
        color: #3A43FF !important;
        font-weight: 700 !important;
    }
    /* 날짜 cell 커스텀 */
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
    /* 선택된 날짜만 숫자에 검정 원 28x28 (글씨 흰색) */
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

    /* 내부 캘린더 컨테이너(전체 박스) */
        :deep(.custom-calendar .vc-pane-container) {
        border: none !important;
        box-shadow: none !important;
        border-radius: 20px !important;     /* 모서리 둥글게 */
        background: #fff !important;
    /* 필요하다면 padding 조정 */
    }

    /* pane-layout 도 같이 덮어쓰기 */
    :deep(.custom-calendar .vc-pane-layout) {
        border: none !important;
        box-shadow: none !important;
        border-radius: 20px !important;
        background: #fff !important;
    }

    /* 실제 캘린더 메인 영역도 덮어쓰기 */
    :deep(.custom-calendar .vc-pane) {
        border: none !important;
        box-shadow: none !important;
        border-radius: 20px !important;
        background: #fff !important;
    }

    /* 불필요한 배경, 그림자, 보더, 색 없애고 radius 적용 */
    :deep(.custom-calendar) {
        border: none !important;
        box-shadow: none !important;
        border-radius: 20px !important;
        background: #fff !important;
    }

    :deep(.custom-calendar .vc-weekdays) {
        border-top: 2px solid #CDCDCD !important;
        padding-top: 10px;   
    }

    :deep(.custom-calendar .vc-title) {
        font-size: 26px !important;   /* 글씨 크게 */
        font-weight: 800 !important;  /* 폰트 두껍게 */
        letter-spacing: -1px;         /* 자간 줄이기 */
        color: #222;                  /* 글씨색 (필요하면) */
    }
</style>