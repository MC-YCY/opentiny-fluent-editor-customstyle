<template>
  <div style="width: 499px">
    <AudioCom :src="srcAudio" :name="'音乐名称'"></AudioCom>
  </div>
</template>
<script setup>
import srcAudio from './views/audio/audioList/yswh.mp3';
import AudioCom from './views/audio/index.vue';
</script>
