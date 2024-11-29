<script setup lang="ts">
import FluentEditor from '@opentiny/fluent-editor'
import '@opentiny/fluent-editor/style.css'
import { fontStyleOptions, listingOptions, alignOptions } from './options'
import { clickRedo, clickUndo, fontSizeChange, fontSizeAdd, fontSizeDel, fontStyleChange, listingChange, alignChange, selectionChange, disabledInput } from './methods'
import { ref, onMounted, defineProps, watch} from 'vue'
const props = defineProps({
  textContent: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: true,
  },
})
watch(
  () => props.disabled,
  () => {
    disabledInput(props, componentEl)
  },
)
let editorRef = ref()
let example = ref()
const TOOLBAR_CONFIG = [
  ['undo', 'redo'],
  [{ size: ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px', '48px', '72px'] }],
  ['bold', 'italic', 'underline'],
  // [{ color: [] }, { background: [] }],
  [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }], //, { list: 'check' }
  // [{ script: 'sub' }, { script: 'super' }],
  // [{ indent: '-1' }, { indent: '+1' }],
  // [{ direction: 'rtl' }],
  // ['link', 'blockquote', 'code', 'code-block'],
  // ['image', 'file', 'better-table'],
  // ['emoji', 'video', 'formula', 'screenshot', 'fullscreen'],
]
const componentEl = ref()
const componentToolbarEl = ref()
onMounted(() => {
  // 执行初始化时，请确保能获取到 DOM 元素，如果是在 Vue 项目中，需要在 onMounted 事件中执行。
  example.value = new FluentEditor(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: TOOLBAR_CONFIG,
    },
  })
  fontSizeOptions.value = TOOLBAR_CONFIG[1][0].size.map(item => {
    return parseInt(item)
  })
  actions.value.fontSize = fontSizeOptions.value[1]
  example.value.on('selection-change', (...args) => {
    selectionChange(componentEl.value, actions.value,  args )
  })
  disabledInput(props, componentEl)
  example.value.root.innerHTML = props.textContent;
})
const fontSizeOptions = ref([])
const actions = ref({
  do: 'undo',
  fontSize: '12',
  fontStyle: [],
  listing: null, // ordered bullet
  align: 'left',
})
const getHTML = () => {
  return example.value.root.innerHTML
}
defineExpose({
  name: 'editor',
  getHTML,
})
</script>

<template>
  <div class="editor" ref="componentEl" :class="{ disabled: !props.disabled }">
    <div class="editor-ql-toolbar" ref="componentToolbarEl">
      <div class="editor-toolbar-item">
        <div class="editor-undo" @click.stop="clickUndo($event, componentEl, actions)">
          <img src="./icons/go_undo.png" alt="" />
        </div>
        <div class="editor-redo" @click.stop="clickRedo($event, componentEl, actions)">
          <img src="./icons/go_redo.png" alt="" />
        </div>
      </div>
      <div class="editor-toolbar-line"></div>
      <div class="editor-toolbar-item" @click.stop.prevent>
        <el-select
          @change="fontSizeChange($event, componentEl, actions, example)"
          v-model="actions.fontSize"
          style="min-width: 60px; max-height: 26px; height: 26px"
          placeholder=""
        >
          <el-option :value="op" v-for="op in fontSizeOptions">{{ op }}px</el-option>
        </el-select>
        <div class="editor-font-add" @click="fontSizeAdd($event, componentEl, actions)">
          <img src="./icons/font-add.png" alt="" />
        </div>
        <div class="editor-font-del" @click="fontSizeDel($event, componentEl, actions)">
          <img src="./icons/font-del.png" alt="" />
        </div>
      </div>
      <div class="editor-toolbar-line"></div>
      <div class="editor-toolbar-item">
        <div class="fontStyle-item" v-for="ic in fontStyleOptions" @click="fontStyleChange($event, componentEl, actions, example, ic)">
          <img :src="actions.fontStyle.includes(ic.value) ? ic.icon2 : ic.icon1" alt="" />
        </div>
      </div>
      <div class="editor-toolbar-line"></div>
      <div class="editor-toolbar-item">
        <div class="listing-item" v-for="ic in listingOptions" @click="listingChange($event, componentEl, actions, example, ic)">
          <img :src="actions.listing === ic.value ? ic.icon2 : ic.icon1" alt="" />
        </div>
      </div>
      <div class="editor-toolbar-line"></div>
      <div class="editor-toolbar-item">
        <div class="align-item" v-for="ic in alignOptions" @click="alignChange($event, componentEl, actions, example, ic)">
          <img :src="actions.align === ic.value ? ic.icon2 : ic.icon1" alt="" />
        </div>
      </div>
    </div>
    <div ref="editorRef"></div>
  </div>
</template>

<style scoped lang="less">
.editor {
  background: rgba(245, 246, 247, 1);
  border-radius: 10px;
  padding: 22px 20px;
  :deep(.ql-toolbar) {
    border: none;
    background-color: transparent !important;
    display: none;
    .ql-picker {
      min-width: 60px;
      height: 26px;
      background-color: white;
      border: 1px solid rgba(228, 235, 242, 1);
      border-radius: 6px;
      .ql-picker-label {
        padding: 0 10px;
        &:before {
          width: 100%;
          padding: 0;
          height: 26px;
          line-height: 26px;
        }
        svg {
          right: 10px;
        }
      }
      .ql-picker-options {
        width: 100%;
        margin-left: 0;
      }
    }
  }
  .ql-container {
    border: none;
    background-color: transparent;
  }
  :deep(.ql-editor) {
    padding-left: 0;
    padding-right: 0;
    transition: all 0.2s linear;
  }
}
.editor-ql-toolbar {
  display: flex;
  align-items: center;
  height: 50px;
  overflow: hidden;
  transition: all 0.2s linear;
  border-bottom: 1px solid rgba(216, 216, 216, 1) !important;
  padding-bottom: 20px;
  .editor-toolbar-item {
    display: flex;
    height: 26px;
    align-items: center;
    .editor-undo,
    .editor-redo {
      width: 14px;
      height: 14px;
      cursor: pointer;
      display: flex;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .editor-redo {
      margin-left: 14px;
    }
    .editor-font-add,
    .editor-font-del {
      min-width: 15px;
      width: 15px;
      max-width: 15px;
      min-height: 27px;
      max-height: 27px;
      height: 27px;
      cursor: pointer;
      transform: translateY(-2px);
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .editor-font-add {
      margin-left: 14px;
      margin-right: 10px;
    }
    :deep(.el-select) {
      .el-select__wrapper {
        height: 26px !important;
        min-height: 26px !important;
      }
    }
    .fontStyle-item {
      width: 10px;
      height: 14px;
      min-width: 10px;
      min-height: 14px;
      max-width: 10px;
      max-height: 14px;
      display: flex;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .fontStyle-item + .fontStyle-item {
      margin-left: 30px;
    }
    .listing-item {
      width: 17px;
      height: 15px;
      min-width: 17px;
      min-height: 15px;
      max-width: 17px;
      max-height: 15px;
      display: flex;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .listing-item + .listing-item {
      margin-left: 24px;
    }
    .align-item {
      width: 16px;
      height: 15px;
      min-width: 16px;
      min-height: 15px;
      max-width: 16px;
      max-height: 15px;
      display: flex;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .align-item + .align-item {
      margin-left: 24px;
    }
  }
  .editor-toolbar-line {
    margin: 0 24px;
    height: 20px;
    width: 2px;
    background-color: rgba(216, 216, 216, 1);
  }
}
.disabled {
  .editor-ql-toolbar {
    height: 0 !important;
    padding-bottom: 0 !important;
    border-color: transparent !important;
  }
  :deep(.ql-editor) {
    padding-top: 0 !important;
  }
}
</style>
