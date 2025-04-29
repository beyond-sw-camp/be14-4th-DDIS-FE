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

<style scoped>

</style>