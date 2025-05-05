// src/composables/useMusicKit.ts
import { ref, onMounted } from 'vue'
const token = import.meta.env.VITE_APPLE_MUSIC_TOKEN;


export function useMusicKit() {
    const isAuthorized = ref(false)
    const isAuthorizing = ref(false)
    const music = ref<any>(null)

    const loadMusicKit = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if ((window as any).MusicKit) {
                initMusicKit()
                resolve()
            } else {
                window.addEventListener('musickitloaded', () => {
                    initMusicKit()
                    resolve()
                })
            }
        })
    }

    const initMusicKit = () => {
        const MusicKit = (window as any).MusicKit
        MusicKit.configure({
            developerToken: token,
            app: {
                name: 'OpenAM',
                build: '0.1.0',
            },
        })
        music.value = MusicKit.getInstance()
        isAuthorized.value = music.value.isAuthorized
    }

    const login = async () => {
        isAuthorizing.value = true
        try {
            await music.value?.authorize()
            isAuthorized.value = music.value?.isAuthorized
        } catch (err) {
            console.error('Authorize error:', err)
        } finally {
            isAuthorizing.value = false
        }
    }

    const logout = async () => {
        try {
            await music.value?.unauthorize()
            isAuthorized.value = music.value?.isAuthorized
        } catch (err) {
            console.error('Unauthorize error:', err)
        }
    }

    onMounted(() => {
        loadMusicKit()
    })

    return {
        music,
        isAuthorized,
        isAuthorizing,
        login,
        logout,
    }
}