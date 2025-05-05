<script setup lang="ts">
import {ref} from 'vue'
import {onMounted} from 'vue'

const isAuthorized = ref(false)
const isAuthorizing = ref(false)
const username = ref('')
var music

onMounted(() => {
  document.addEventListener('musickitloaded', async function () {
    const MusicKit = window.MusicKit
    await MusicKit.configure({
      developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlM1RkRKN1pGRzcifQ.eyJpYXQiOjE3NDY0MDQ5MDEsImV4cCI6MTc2MTk1NjkwMSwiaXNzIjoiOEdZWFRDU1pQWiJ9.WVN7EsvzkvOXNInvZjqFGeWQsyT1iCivSIMLIOhmKk_gJ9c_QyC1SsYITxLrxnMxxjMBaBOdA0vhOm5NhZkOCg',
      app: {
        name: 'OpenAM',
        build: '0.1.0'
      }
    })
    music = MusicKit.getInstance()
    isAuthorized.value = music.isAuthorized
  })
})

const login = async () => {
  isAuthorizing.value = true
  if (music) {
    try {
      await music.authorize();
    } catch (error) {
      console.error('Authorization error:', error);
    }
    isAuthorized.value = music.isAuthorized
  }
  isAuthorizing.value = false
}
const logout = async () => {
  if (music) {
    try {
      await music.unauthorize()
    } catch (error) {
      console.error('Logout error:', error)
    }
    isAuthorized.value = music.isAuthorized
  }
}
</script>

<template>
  <img src="../assets/OpenAMIcon.png" class="app-icon"/>
  <h2>Welcome to OpenAM</h2>
  <div v-if="!isAuthorized">
    <button @click="login" type="button" class="sign-in-button" :disabled="isAuthorizing"
            :style="{
                backgroundColor: isAuthorizing ? '#666' : 'red',
                position: 'relative'
            }">
      <div v-if="isAuthorizing" class="progress-overlay"></div>
      <svg viewBox="0 0 10 11" style="fill: white; width: 13pt; margin: 4pt;">
        <path
            d="M5 5.295c-1.296 0-2.385-1.176-2.385-2.678C2.61 1.152 3.716 0 5 0c1.29 0 2.39 1.128 2.39 2.611C7.39 4.12 6.297 5.295 5 5.295zM1.314 11C.337 11 0 10.698 0 10.144c0-1.55 1.929-3.685 5-3.685 3.065 0 5 2.135 5 3.685 0 .554-.337.856-1.314.856z">
        </path>
      </svg>
      <span style="color: white; font-size: 13pt;">
                {{ isAuthorizing ? '登录中...' : '登录' }}
            </span>
    </button>
  </div>
  <div v-else>

    <button @click="logout" type="button">
      <span style="font-size: 13pt;">退出</span>
    </button>
  </div>
</template>

<style>

.app-icon {
  mask-image: url('../assets/AppIconMask.svg');
  mask-repeat: no-repeat;
  mask-size: contain;
  width: 100px;
  height: 100px;
}

.sign-in-button {
  align-items: center;
  border: none;
  border-radius: 6pt;
  background-color: red;
  display: inline-flex;
  height: 28pt;
  justify-content: center;
  min-width: 64pt;
  padding: 0 24pt;
  white-space: nowrap;
}

.sign-in-button:disabled {
  cursor: not-allowed;
}

.progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6pt;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-overlay::after {
  content: "";
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>