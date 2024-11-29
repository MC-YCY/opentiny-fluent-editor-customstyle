<script setup lang="ts">
defineExpose({
  name: "Audio"
})
import {defineProps, ref} from 'vue';
import {Props} from './audio.ts';
import playIcon from './iamge/play.png';
import pauseIcon from './iamge/pause.png';
import volumeIcon from './iamge/volume.png';
import Progress from './components/progress.vue';

const props = defineProps<Props>();
const audio = ref();
const audioInfo = ref({
  value:0,
  count:300,
  volume:50,
  play:false
})
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);  // 计算分钟（整数部分）
  const remainingSeconds = Math.floor(seconds % 60); // 计算秒数（整数部分）
  // 使用 `padStart` 来确保每个部分都有两位数
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

const audioRun = () =>{
  audioInfo.value.play = !audioInfo.value.play;
  const play = audioInfo.value.play;
  if(play){
    audio.value.play();
  }else{
    audio.value.pause();
  }
}

const timeupdate = () =>{
  audioInfo.value.value = audio.value.currentTime;
}
const loadedmetadata = () =>{
  audioInfo.value.value = audio.value.currentTime;
  audioInfo.value.count = audio.value.duration;
  audio.value.volume = audioInfo.value.volume  / 100;
}
const changeValue = () =>{
  audio.value.currentTime = audioInfo.value.value;
}
const changeVolume = () =>{
  audio.value.volume = audioInfo.value.volume / 100;
}
</script>

<template>
  <div class="audio-content">
    <div class="audio-content-run" @click="audioRun">
      <img v-if="!audioInfo.play" :src="playIcon" alt="">
      <img v-else :src="pauseIcon" alt="">
    </div>
    <div class="audio-content-control">
      <div class="audio-content-control-info">
        <span class="acci-name">{{ props.name }}</span>
        <span class="acci-time">{{formatTime(audioInfo.value)}} / {{formatTime(audioInfo.count)}}</span>
      </div>
      <div class="audio-content-control-progress">
        <Progress @change="changeValue" v-model:value="audioInfo.value" :count="audioInfo.count" orientation="horizontal"></Progress>
      </div>
    </div>
    <div class="audio-content-volume">
      <img :src="volumeIcon" alt="">
      <div class="audio-content-volume-progress">
        <Progress @change="changeVolume" v-model:value="audioInfo.volume" count="100" orientation="vertical"></Progress>
      </div>
    </div>
  </div>
  <audio @timeupdate="timeupdate" @loadedmetadata="loadedmetadata" class="audio" :src="props.src" ref="audio"></audio>
</template>

<style scoped>
.audio {
  display: none;
  width: 0;
  height: 0;
  overflow: hidden;
}
.audio-content{
  height: 60px;
  width: 100%;
  display: flex;
  border-radius: 10px;
  background: rgba(245, 246, 247, 1);
  padding: 15px 20px;
  align-items: center;
  box-sizing: border-box;
}
.audio-content-run{
  width: 30px;
  min-width: 30px;
  max-width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 14px;
}
.audio-content-run img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.audio-content-control{
  flex: 1;
}
.audio-content-volume{
  margin-left: 20px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  position: relative;
}
.audio-content-volume img{
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.audio-content-control-info{
  height: 20px;
  display: flex;
  justify-content: space-between;
}
.acci-name{
  color: rgba(60, 76, 102, 0.66);
  font-size: 14px;
  font-weight: 500;
}
.acci-time{
  font-size: 14px;
  font-weight: 400;
  color: rgba(118, 133, 157, 1);
}
.audio-content-control-progress{
  height: 12px;
  margin-top: 5px;
}
.audio-content-volume-progress{
  height: 50px;
  position: absolute;
  padding: 4px;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  justify-content: center;
  background: rgba(245, 246, 247, 1);
  border-radius: 10px;
  box-shadow: 0 0 4px #ccc;
  display: none;
}
.audio-content-volume:hover .audio-content-volume-progress{
  display: flex;
}
</style>
