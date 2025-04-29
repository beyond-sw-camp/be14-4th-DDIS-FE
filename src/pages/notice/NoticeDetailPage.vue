<template>
    <div class="detail-page">
      <h1>공지사항 상세</h1>
      <div v-if="notice">
        <h2>{{ notice.title }}</h2>
        <p>{{ notice.date }}</p>
        <p class="content">{{ notice.content }}</p>
      </div>
      <div v-else>
        <p>공지사항을 찾을 수 없습니다.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "NoticeDetailPage",
    data() {
      return {
        notice: null,
        notices: [
          { id: 9, title: "신규 기능 출시", date: "2025-04-23", content: "신규 기능을 출시했습니다!" },
          { id: 8, title: "이용 약관 변경 안내", date: "2025-04-22", content: "이용 약관이 변경되었습니다." },
          // ...나머지 더미 데이터
        ],
      };
    },
    mounted() {
      const noticeId = parseInt(this.$route.params.id);
      this.notice = this.notices.find(n => n.id === noticeId);
    },
  };
  </script>
  
  <style scoped>
  .detail-page {
    padding: 40px;
    text-align: center;
  }
  .content {
    margin-top: 20px;
  }
  </style>
  