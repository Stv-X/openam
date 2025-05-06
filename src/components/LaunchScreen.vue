<script setup lang="ts">
    import { ref } from 'vue'
    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const isAuthorized = ref(false)
    const isAuthorizing = ref(false)
    const isUnauthorizing = ref(false)
    var music

    onMounted(() => {
        document.addEventListener('musickitloaded', async function() {
            const MusicKit = window.MusicKit
            await MusicKit.configure({
                developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlM1RkRKN1pGRzcifQ.eyJpYXQiOjE3NDY0MDQ5MDEsImV4cCI6MTc2MTk1NjkwMSwiaXNzIjoiOEdZWFRDU1pQWiJ9.WVN7EsvzkvOXNInvZjqFGeWQsyT1iCivSIMLIOhmKk_gJ9c_QyC1SsYITxLrxnMxxjMBaBOdA0vhOm5NhZkOCg',
                app: {
                    name: 'OpenAM',
                    build: '0.1.0'
                    // icon: '/assets/OpenAMIcon.png'
                }
            })
            music = MusicKit.getInstance()
            isAuthorized.value = music.isAuthorized
        })
    })

    async function login() {
        isAuthorizing.value = true
        if (music) {
            try {
                await music.authorize()
                isAuthorized.value = music.isAuthorized
                router.push('/home')
            } catch (error) {
                console.error('Authorization error:', error)
            }
        }
        isAuthorizing.value = false
    }
    
    async function logout() {
        isUnauthorizing.value = true
        if (music) {
            try {
                await music.unauthorize()
            } catch (error) {
                console.error('Logout error:', error)
            }
            isAuthorized.value = music.isAuthorized
        }
        isUnauthorizing.value = false
    }

    function home() {
        router.push('/home')
    }
</script>

<template>
    <img src="../assets/OpenAMIcon.png" class="app-icon" />
    <h2>Welcome to OpenAM</h2>
    <div v-if="!isAuthorized">
        <button @click="login" type="button" class="primary-button" :disabled="isAuthorizing"
            :style="{ 
                backgroundColor: isAuthorizing ? '#666' : 'var(--accentColor)',
                position: 'relative'
            }">
            <div v-if="isAuthorizing" class="progress-overlay"></div>
            <svg viewBox="0 0 10 11" style="fill: white; width: 11pt; margin: 4pt;">
                <path d="M5 5.295c-1.296 0-2.385-1.176-2.385-2.678C2.61 1.152 3.716 0 5 0c1.29 0 2.39 1.128 2.39 2.611C7.39 4.12 6.297 5.295 5 5.295zM1.314 11C.337 11 0 10.698 0 10.144c0-1.55 1.929-3.685 5-3.685 3.065 0 5 2.135 5 3.685 0 .554-.337.856-1.314.856z">
                </path>
            </svg>
            <span style="color: white; font-size: 13pt;">
                {{ isAuthorizing ? '登录中...' : '登录' }}
            </span>
        </button>
    </div>
    <div v-else>
        <div>
            <div>
                <button @click="home" class="primary-button" type="button">
                    <span style="color: white; font-size: 13pt;">进入主页</span>
                </button>
            </div>
            <div>
                <button @click="logout" class="secondary-button" type="button" :disabled="isUnauthorizing"
            :style="{ 
                backgroundColor: isUnauthorizing ? '#666' : '',
                position: 'relative'
            }">
                    <div v-if="isUnauthorizing" class="progress-overlay"></div>
                    <span style="color:var(--accentColor); font-size: 13pt;">
                        {{ isUnauthorizing ? '退出中...' : '退出登录' }}
                    </span>
                </button>
            </div>
        </div>
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

.primary-button {
  align-items: center;
  border: none;
  border-radius: 6pt;
  background-color: var(--accentColor);
  display: inline-flex;
  height: 28pt;
  justify-content: center;
  min-width: 64pt;
  padding: 0 24pt;
  white-space: nowrap;
  margin: 3pt;
}

.primary-button:hover {
    background-color: #ff3d63;
}

.primary-button:disabled {
  cursor: not-allowed;
}

.secondary-button {
  align-items: center;
  border: none;
  border-radius: 6pt;
  background-color: rgb(232, 232, 237);
  display: inline-flex;
  height: 28pt;
  justify-content: center;
  min-width: 64pt;
  padding: 0 24pt;
  white-space: nowrap;
  margin: 3pt;
}

.secondary-button:hover {
    background-color: #eaeaee;
}

.progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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