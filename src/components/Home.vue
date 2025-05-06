<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Recommendation {
  id: string;
  type: string;
  attributes: {
    title: {
      stringForDisplay: string;
    };
    isGroupRecommendation: boolean;
    resourceTypes: string[];
  };
  relationships: {
    contents: {
      data: {
        id: string;
        type: string;
        attributes: {
          name: string;
          artwork?: {
            url: string;
          };
          description?: {
            standard: string;
          };
        };
      }[];
    };
  };
}

const recommendations = ref<Recommendation[]>([])

onMounted(async () => {
  const MusicKit = window.MusicKit
  const music = MusicKit.getInstance()
  try {
    const queryParameters = { l: 'zh-cn' }
    const { data: result } = await music.api.music(`/v1/me/recommendations`, queryParameters)
    recommendations.value = result.data
  } catch (e) {
    console.error('Failed to fetch recommendations', e)
  }
})
</script>

<template>
  <apple-music-progress></apple-music-progress>
  <apple-music-playback-controls />
  <h1>Home</h1>
  <div class="recommendations-container">
    <div v-for="recommendation in recommendations" :key="recommendation.id" class="recommendation-section">
      <h2 class="section-title">{{ recommendation.attributes.title.stringForDisplay }}</h2>
      <p v-if="recommendation.attributes.isGroupRecommendation" class="section-subtitle">
        Group recommendation
      </p>
      
      <div class="horizontal-scroll-container">
        <div class="scroll-content">
          <div v-for="content in recommendation.relationships.contents.data" :key="content.id" class="content-wrapper">
            <apple-music-artwork-lockup
              :type="content.type"
              :content-id="content.id"
              class="content-item"
            ></apple-music-artwork-lockup>
            <p class="content-name">{{ content.attributes.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommendations-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: flex-start;
}

.recommendation-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 100%;
}

.section-header {
  text-align: left;
  width: 100%;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  text-align: left;
}

.section-subtitle {
  font-size: 14px;
  margin: 0;
  margin-top: -8px;
  text-align: left;
}

.horizontal-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
  width: 100%;
}

.horizontal-scroll-container::-webkit-scrollbar {
  height: 6px;
  background-color: transparent;
}

.horizontal-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.scroll-content {
  display: inline-flex;
  gap: 16px;
  padding-right: 20px;
}

.content-item {
  flex: 0 0 auto;
  transition: transform 0.2s;
}

.content-name {
  font-size: 13pt;
  margin: 0;
  text-align: left;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .content-wrapper {
    width: 150px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .content-name {
    font-size: 13px;
  }
}
</style>