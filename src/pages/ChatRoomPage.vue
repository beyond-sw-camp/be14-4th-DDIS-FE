<template>
    <div class="chat-page">
      <!-- 좌측 채팅 목록 -->
      <aside class="sidebar">
        <!-- 개인 / 공용 탭 스위치 -->
        <div class="toggle-tabs">
          <button
            class="toggle-btn"
            :class="{ active: activeTab === '개인' }"
            @click="activeTab = '개인'"
          >
            개인
          </button>
          <button
            class="toggle-btn"
            :class="{ active: activeTab === '공용' }"
            @click="activeTab = '공용'"
          >
            공용
          </button>
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
          <br>
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
import { ref, computed, onMounted, watch } from 'vue'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import axios from 'axios'

const chatList = ref([])
const search = ref('')
const newMessage = ref('')
const selectedChat = ref(null)
const messages = ref([])
const clientId = 11 // 실제 사용자 ID로 교체
let stompClient = null
let lastMessageId = null

const activeTab = ref('공용')  // 기본값: 개인

// // 필터링 예시 (선택사항)
// const filteredChats = computed(() =>
//   chatList.value
//     .filter(chat => (chat.name || '').toLowerCase().includes(search.value.toLowerCase()))
//     .filter(chat => activeTab.value === '공용' ? chat.type === '공용' : chat.type === '개인')
// )


onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/chat-room/all-chat-room')
    console.log('채팅방 목록 응답:', res.data) // 👈 이거 확인
    // chatList.value = res.data
    chatList.value = res.data.map(item => ({
      id: item.chatRoomNum,
      name: item.chatRoomName,
      room: item.roomNum,
      time: item.createdTime,
      type: '공용'
    }))
  } catch (err) {
    console.error('채팅 목록 로딩 실패:', err)
  }

  const socket = new SockJS('http://localhost:8080/ws-chat')
  stompClient = Stomp.over(socket)

  stompClient.connect({}, () => {
    console.log('WebSocket 연결 완료')
  }) 
})

// const filteredChats = computed(() =>
//   chatList.value.filter(chat =>
//     (chat.name || '').toLowerCase().includes(search.value.toLowerCase())
//   )
// )


// 필터링 예시 (선택사항)
const filteredChats = computed(() =>
  chatList.value
    .filter(chat => (chat.name || '').toLowerCase().includes(search.value.toLowerCase()))
    .filter(chat => activeTab.value === '공용' ? chat.type === '공용' : chat.type === '개인')
)

watch(selectedChat, (chat) => {
  if (!chat || !stompClient?.connected) return

  const roomId = chat.id
  messages.value = []

  stompClient.subscribe(`/sub/chatroom/${roomId}`, message => {
    const msg = JSON.parse(message.body)
    messages.value.push(msg)
    lastMessageId = msg.id
  })

  stompClient.send('/pub/chat.read', {}, JSON.stringify({
    roomId: Number(selectedChat.value.id),
    clientId: Number(clientId),
    lastReadMessageId: lastMessageId || 0
  }))
})

function selectChat(chat) {
  selectedChat.value = chat
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedChat.value) return

  const messageData = {
    chatRoomNum: Number(selectedChat.value.id),
    sender: Number(clientId),            // 로그인된 사용자 ID
    message: newMessage.value,
    sendTime: new Date().toISOString()        // ISO 포맷 시간
  }

  // 화면에 먼저 표시
  messages.value.push({
    ...messageData,
    sender: 'me',
    text: messageData.message,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    id: Date.now()
  })

  // 서버에 메시지 전송 및 저장 요청
  stompClient.send('/pub/chat/send', {}, JSON.stringify(messageData))
  stompClient.subscribe(`/sub/chatroom/${roomId}`, message => {
    const msg = JSON.parse(message.body)
    messages.value.push(msg)
    lastMessageId = msg.id
  })

  newMessage.value = ''
}


</script>



<style scoped>
  .chat-page {
    display: flex;
    height: 90vh;
    padding-top: 50px;
    margin-top: 30px;
    /* font-family: 'Arial', sans-serif; */
  }
  .sidebar {
    width: 280px;
    background: #fff;
    border-right: 1px solid #f6f6f6;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  .toggle-tabs {
    display: flex;
    background: #e5e5e5;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 16px;
    width: fit-content;
    align-self: center;
  }

  .toggle-btn {
    flex: 1;
    padding: 6px 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-weight: bold;
    color: #333;
    font-size: 14px;
    border-radius: 0;
  }

  .toggle-btn.active {
    background: #84d4c2;
    color: white;
    border-radius: 12px 0 0 12px;
  }

  .toggle-btn:last-child.active {
    border-radius: 0 12px 12px 0;
  }

  .search {
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
  .chat-list {
    flex: 1;
    overflow-y: auto;
  }
  .chat-item {
    padding: 10px;
    /* border-radius: 5px; */
    cursor: pointer;
    margin-bottom: 10px;
    background: white;
    border-bottom: 1.5px solid #ccc;
  }
  .chat-item.active {
    background: #e3fff9;
    font-weight: bold;
    border-radius: 10px;
  }
  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f6f6f6;
  }
  .chat-header {
    padding: 5px;
    border-bottom: 1px solid #ccc;
    background: white;
  }
  .chat-name {
    font-weight: bold;
    font-size: 16px;
    margin-top: 10px;
    margin-left: 50px;
  }
  .chat-status {
    font-size: 12px;
    color: #999;
    margin-left: 50px;
    margin-bottom: 10px;
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
    border-radius: 25px;
    max-width: 60%;
    position: relative;
  }
  .message.me {
    align-self: flex-end;
    background: #b0e7b2;
    border-radius: 25px;
    padding: 10px 18px;
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
    border-top: 1px solid #e5e5e5;
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
    padding: 10px 14px;
    margin-left: 10px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
  }
</style>
  