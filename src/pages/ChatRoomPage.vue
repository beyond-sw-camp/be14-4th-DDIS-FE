<template>
    <div class="dm-page">
      <!-- 좌측 채팅 목록 -->
      <aside class="sidebar">
        <div class="logo">to-do ddu-du</div>
        <div class="tabs">
          <button class="tab active">채팅</button>
          <button class="tab">알림</button>
        </div>
        <input class="search" type="text" placeholder="Search" v-model="search" />
        <div class="chat-list">
          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            class="chat-item"
            :class="{ active: selectedChat && chat.id === selectedChat.id }"
            @click="selectChat(chat)"
          >
            <div class="name">{{ chat.name }}</div>
            <div class="preview">{{ chat.latestMessage }}</div>
          </div>
        </div>
      </aside>
  
      <!-- 우측 채팅 내용 -->
      <main class="chat-area">
        <div class="chat-header">
          <div class="chat-name">{{ selectedChat?.name || '대화를 선택하세요' }}</div>
          <div class="chat-status">최근 접속: {{ selectedChat?.lastSeen || '-' }}</div>
        </div>
        <div class="chat-messages">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message"
            :class="{ me: msg.sender === 'me' }"
          >
            <div class="message-text">{{ msg.text }}</div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>
        <div class="chat-input">
          <input v-model="newMessage" type="text" placeholder="Message" @keyup.enter="sendMessage" />
          <button @click="sendMessage">➤</button>
        </div>
      </main>
    </div>
</template>
  
<script setup>
  import { ref, computed } from 'vue'
  
  const search = ref('')
  const newMessage = ref('')
  const selectedChat = ref(null)

  onMounted(() => {
    const socket = new SockJS('http://localhost:8080/ws')
    stompClient = Stomp.over(socket)

    stompClient.connect({}, () => {
        // ✅ 메시지 수신
        stompClient.subscribe(`/topic/dm/${roomId}`, message => {
        const msg = JSON.parse(message.body)
        messages.value.push(msg)
        lastMessageId = msg.id
        })

        // ✅ 채팅방 진입 시 읽음 처리 요청
        stompClient.send('/app/chat.read', {}, JSON.stringify({
        roomId,
        clientId,
        lastReadMessageId: lastMessageId || 0
        }))
    })
  })
  
  const chatList = ref([
    { id: 1, name: 'ChatGPT', latestMessage: '챗봇이 반응했습니다.', lastSeen: '1분 전' },
    { id: 2, name: 'Jessica Drew', latestMessage: 'See you soon 👋', lastSeen: '2시간 전' },
    { id: 3, name: 'David Moore', latestMessage: 'okay', lastSeen: '1분 전' },
  ])
  
  const messages = ref([])
  let lastMessageId = null

  let stompClient = null
  
  const filteredChats = computed(() => {
    return chatList.value.filter(chat =>
      chat.name.toLowerCase().includes(search.value.toLowerCase())
    )
  })
  
  function selectChat(chat) {
    selectedChat.value = chat
    // 예시 메시지 불러오기
    messages.value = [
      { id: 1, text: 'Do you remember what you did?', time: 'Today', sender: 'you' },
      { id: 2, text: 'no haha', time: 'now', sender: 'me' },
      { id: 3, text: 'I don’t remember anything 😅', time: 'now', sender: 'me' },
    ]
  }
  
  function sendMessage() {
    if (!newMessage.value.trim()) return
    messages.value.push({
      id: Date.now(),
      text: newMessage.value,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me'
    })
    newMessage.value = ''
  }
</script>

<style scoped>
  .dm-page {
    display: flex;
    height: 100vh;
    font-family: 'Arial', sans-serif;
  }
  .sidebar {
    width: 300px;
    background: #fff;
    border-right: 1px solid #ccc;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  .logo {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
  }
  .tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  .tab {
    flex: 1;
    padding: 8px;
    border: none;
    background: #eee;
    cursor: pointer;
    font-weight: bold;
  }
  .tab.active {
    background: #333;
    color: white;
  }
  .search {
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .chat-list {
    flex: 1;
    overflow-y: auto;
  }
  .chat-item {
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 8px;
    background: #f9f9f9;
  }
  .chat-item.active {
    background: #e0f7ff;
    font-weight: bold;
  }
  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f6f6f6;
  }
  .chat-header {
    padding: 16px;
    border-bottom: 1px solid #ccc;
    background: white;
  }
  .chat-name {
    font-weight: bold;
    font-size: 18px;
  }
  .chat-status {
    font-size: 12px;
    color: #999;
  }
  .chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .message {
    align-self: flex-start;
    background: #e5e5e5;
    padding: 10px 14px;
    border-radius: 14px;
    max-width: 60%;
    position: relative;
  }
  .message.me {
    align-self: flex-end;
    background: #b0e7b2;
  }
  .message-time {
    font-size: 10px;
    text-align: right;
    margin-top: 4px;
    color: #666;
  }
  .chat-input {
    display: flex;
    padding: 16px;
    background: white;
    border-top: 1px solid #ccc;
  }
  .chat-input input {
    flex: 1;
    padding: 10px;
    font-size: 14px;
    border-radius: 20px;
    border: 1px solid #ccc;
  }
  .chat-input button {
    background: #50d4c6;
    border: none;
    color: white;
    padding: 10px 16px;
    margin-left: 10px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
  }
</style>
  