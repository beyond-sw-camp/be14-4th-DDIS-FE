<template>
  <div class="todo-list-wrapper">
    <div v-if="todos.length === 0" class="no-todos">할 일이 없어요!</div>
    <div v-else>
      <div
        v-for="(group, categoryName) in groupedTodos"
        :key="categoryName"
        class="category-group"
      >
        <div class="category-header" :style="{ color: group.color }">
          {{ categoryName }}
        </div>

        <TodoItem
          v-for="todo in group.todos"
          :key="todo.todo_num"
          :todo="todo"
          :categoryColor="group.color"
        @update-pin="handleUpdatePin"
        @toggle-done="handleToggleDone"
        @toggle-public="handleTogglePublic"
        @delete="handleDeleteTodo"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, toRefs } from 'vue'
import TodoItem from './TodoItem.vue'

const props = defineProps({
  todos: Array
})
const emit = defineEmits(['update-pin', 'toggle-done', 'toggle-public', 'delete'])

const groupedTodos = computed(() => {
  const groups = {}
  props.todos.forEach(todo => {
    const category = todo.category_name || '기타'
    if (!groups[category]) {
      groups[category] = {
        color: todo.category_color || '#ccc',
        todos: []
      }
    }
    groups[category].todos.push(todo)
  })
  return groups
})

 function handleUpdatePin(todo) {
  console.log('TodoList got update-pin', todo)
   emit('update-pin', todo)
 }
 function handleToggleDone(todo) {
   emit('toggle-done', todo)
 }
 function handleTogglePublic(todo) {
   emit('toggle-public', todo)
 }
 function handleDeleteTodo(todo) {
   emit('delete', todo)
 }
</script>

<style scoped>
.todo-list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1px;
  background: #fff;
  padding: 0px 0 48px;
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(30, 30, 30, 0.05);
  width: 770px;
  max-width: 770px;
  user-select: none;
  scrollbar-gutter: stable both-edges;
  overflow-y: auto; /* 컨테이너 내부 스크롤 */
}

.category-group {
  margin-bottom: 32px;
  width: 100%;
}

.category-header {
  font-size: 17px;
  font-weight: 800;
  margin: 0 16px 16px;
  user-select: none;
}

.no-todos {
  text-align: center;
  color: #888;
  padding: 40px 0;
  user-select: none;
}
</style>
