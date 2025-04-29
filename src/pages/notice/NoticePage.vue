<template>
    <div class="notice-page">
      <!-- 상단 메뉴 -->
      <header class="main-header">
        <Header></Header>
      </header>
  
      <!-- 공지사항 메인 -->
      <main class="content">
        <h1 class="title">서비스 공지사항</h1>
  
        <table class="notice-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(notice, index) in paginatedNotices" :key="notice.id">
                <td>{{ notice.id }}</td>
                <td>
                <RouterLink :to="`/notice/${notice.id}`" class="link">
                    {{ notice.title }}
                </RouterLink>
                </td>
                <td>{{ notice.date }}</td>
            </tr>
            </tbody>

        </table>
  
        <!-- 페이지네이션 -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">◀</button>
          <button
            v-for="page in totalPages"
            :key="page"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages">▶</button>
        </div>
      </main>
    </div>
  </template>
  
  <script>
    import Header from '@/components/header/Header.vue';
  export default {
    name: "NoticePage",
    data() {
      return {
        notices: [
          { id: 9, title: "신규 기능 출시", date: "2025-04-23" },
          { id: 8, title: "이용 약관 변경 안내", date: "2025-04-22" },
          { id: 7, title: "서버 오류 안내", date: "2025-04-21" },
          { id: 6, title: "이벤트 안내", date: "2025-04-20" },
          { id: 5, title: "앱 업데이트 공지", date: "2025-04-19" },
          { id: 4, title: "계정 보안 강화 안내", date: "2025-04-18" },
          { id: 3, title: "정기 점검 예고", date: "2025-04-17" },
          { id: 2, title: "공지사항 기능 개선", date: "2025-04-16" },
        ],
        currentPage: 1,
        perPage: 5,
      };
    },
    computed: {
      paginatedNotices() {
        const start = (this.currentPage - 1) * this.perPage;
        return this.notices.slice(start, start + this.perPage);
      },
      totalPages() {
        return Math.ceil(this.notices.length / this.perPage);
      },
    },
    methods: {
      prevPage() {
        if (this.currentPage > 1) this.currentPage--;
      },
      nextPage() {
        if (this.currentPage < this.totalPages) this.currentPage++;
      },
      goToPage(page) {
        this.currentPage = page;
      },
    },
  };
  </script>
  
  <style scoped>
  /* 공통 스타일 */
  .notice-page {
    background: #f2f2f2;
    min-height: 100vh;
    font-family: 'Arial', sans-serif;
  }
  
  /* 상단 헤더 */
  .main-header {
    width: 100%;
    background: white;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }
  
  .inner-header {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .logo {
    font-size: 20px;
    font-weight: bold;
  }
  
  .nav-menu a {
    margin: 0 15px;
    text-decoration: none;
    color: #333;
  }
  
  .nav-menu .active {
    font-weight: bold;
    border-bottom: 2px solid black;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .icon {
    width: 24px;
    height: 24px;
  }
  
  .nickname {
    font-weight: 600;
  }
  
  .profile-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
  
  /* 본문 */
  .content {
    background: white;
    margin: 30px auto;
    padding: 30px;
    border-radius: 10px;
    max-width: 800px;
    text-align: center;
  }
  
  .title {
    font-size: 28px;
    margin-bottom: 20px;
  }
  
  /* 테이블 */
  .notice-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .notice-table th,
  .notice-table td {
    border-bottom: 1px solid #ddd;
    padding: 12px;
  }
  
  .notice-table th {
    background: #f9f9f9;
  }
  
  /* 페이지네이션 */
  .pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  
  .pagination button {
    border: none;
    background: none;
    font-size: 18px;
    cursor: pointer;
    padding: 5px 10px;
  }
  
  .pagination .active {
    font-weight: bold;
    text-decoration: underline;
  }
  </style>
  