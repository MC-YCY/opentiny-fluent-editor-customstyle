<template>
  <div
      class="progress-bar"
      ref="progressBarRef"
      @mousedown="handleBarClick"
      :class="orientation"
  >
    <div class="progress" :style="progressStyle"></div>
    <div
        class="thumb"
        :style="thumbStyle"
        @mousedown="handleThumbMouseDown"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

interface Props {
  value: number;
  count: number;
  orientation: 'horizontal' | 'vertical'; // 新增的控制方向的参数
}

const props = defineProps<Props>();
interface Emit {
  'update:value': (value: number) => void;
  'change': (value: number) => void;
}
const emit = defineEmits<Emit>();

const isDragging = ref(false);
const progressBarRef = ref<HTMLElement | null>(null);

// 计算进度条的宽度或高度
const progressWidth = computed(() => (props.value / props.count) * 100);

// 根据方向选择不同的样式
const progressStyle = computed(() => {
  if (props.orientation === 'horizontal') {
    return { width: `${progressWidth.value}%` };
  } else {
    // 如果是竖直方向，进度从下到上增加
    return { height: `${progressWidth.value}%`, bottom: 0 };
  }
});

const thumbStyle = computed(() => {
  if (props.orientation === 'horizontal') {
    return { left: `${progressWidth.value}%` };
  } else {
    // 如果是竖直方向，thumb 应该从底部开始定位
    return { bottom: `${progressWidth.value}%` };
  }
});

// 处理点击进度条
const handleBarClick = (e: MouseEvent) => {
  const rect = progressBarRef.value?.getBoundingClientRect();
  if (!rect) return;

  let newProgress: number;
  if (props.orientation === 'horizontal') {
    newProgress = ((e.clientX - rect.left) / rect.width) * props.count;
  } else {
    // 竖直方向时，点击的位置计算方式反转
    newProgress = ((rect.bottom - e.clientY) / rect.height) * props.count;
  }

  let value = Math.min(props.count, Math.max(0, newProgress))
  emit('update:value', value);
  emit('change',value)
};

// 处理拖拽滑块
const handleThumbMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  isDragging.value = true;

  const handleMouseMove = (moveEvent: MouseEvent) => {
    if (!isDragging.value || !progressBarRef.value) return;
    const rect = progressBarRef.value.getBoundingClientRect();
    let newProgress: number;

    if (props.orientation === 'horizontal') {
      newProgress = ((moveEvent.clientX - rect.left) / rect.width) * props.count;
    } else {
      // 竖直方向时，拖拽的计算方式反转
      newProgress = ((rect.bottom - moveEvent.clientY) / rect.height) * props.count;
    }
    let value = Math.min(props.count, Math.max(0, newProgress))
    emit('update:value', value);
    emit('change',value)
  };

  const handleMouseUp = () => {
    isDragging.value = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
};

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('mousemove', handleThumbMouseDown);
  window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style scoped>
.progress-bar {
  position: relative;
  user-select: none;
  cursor: pointer;
}

.progress-bar.horizontal {
  width: 100%;
  height: 8px;
  background-color: rgba(224, 227, 234, 1);
  border-radius: 4px;
}

.progress-bar.vertical {
  width: 8px;
  height: 100%;
  background-color: rgba(224, 227, 234, 1);
  border-radius: 4px;
}

.vertical .progress {
  background-image: linear-gradient(220.55deg, #867EE6 15.27%, #4A86FF 49.16%);
  bottom: 0;
  position: absolute;
  width: 100%;
}
.vertical .thumb {
  transform: translate(-50%,50%);
}

.horizontal .progress {
  height: 100%;
  background-image: linear-gradient(220.55deg, #867EE6 15.27%, #4A86FF 49.16%);
}

.progress {
  border-radius: 4px;
}

.thumb {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border: 3px solid rgba(245, 246, 247, 1);
  border-radius: 50%;
  cursor: pointer;
  background-image: linear-gradient(220.55deg, #867EE6 15.27%, #4A86FF 49.16%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.progress-bar.horizontal .thumb {
  top: 50%;
}

.progress-bar.vertical .thumb {
  left: 50%;
  bottom: 0; /* Start from bottom for vertical */
}
</style>
