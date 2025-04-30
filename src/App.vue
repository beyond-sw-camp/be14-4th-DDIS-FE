<template>
  <header>
    <Header/>
  </header>
  <div>
    <RouterView/>
  </div>
  <footer>
    <Footer/>
  </footer>
</template>

<script setup>
  import { RouterView } from 'vue-router';
  import Header from '@/components/header/Header.vue'
  import Footer from '@/components/footer/Footer.vue'

  
</script>

<style>
/* scoped 빼야 함!! */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

html {
  overflow-y: scroll;
}
</style>