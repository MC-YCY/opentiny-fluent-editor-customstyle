//撤回
export const clickUndo = (event, componentEl, actions) => {
  let el = componentEl.querySelector('.ql-undo')
  if (el) el.click()
}
// 撤回下一步
export const clickRedo = (event, componentEl, actions) => {
  let el = componentEl.querySelector('.ql-redo')
  if (el) el.click()
}
// 字体大小切换change
export const fontSizeChange = (event, componentEl, actions, example) => {
  let els = [...componentEl.querySelectorAll('.ql-size .ql-picker-options .ql-picker-item')]
  let fontSize = actions.fontSize + 'px'
  let findEl = els.find(el => {
    if (el.dataset.value === fontSize) {
      return el
    }
  })
  findEl && findEl.click()
  requestAnimationFrame(() => {
    try {
      example.focus()
    } catch (e) {
      console.log(e.message)
    }
  })
}
export const fontSizeAdd = (event, componentEl, actions, example) => {
  let els = [...componentEl.querySelectorAll('.ql-size .ql-picker-options .ql-picker-item')]
  let fontSize = actions.fontSize + 'px'
  let findIndex = els.findIndex(el => {
    if (el.dataset.value === fontSize) {
      return el
    }
  })
  findIndex++
  if (findIndex > els.length - 1) {
    findIndex = els.length - 1
  }
  els[findIndex] && els[findIndex].click()
  actions.fontSize = parseInt(els[findIndex].dataset.value)
  requestAnimationFrame(() => {
    try {
      example.focus()
    } catch (e) {
      console.log(e.message)
    }
  })
}
export const fontSizeDel = (event, componentEl, actions, example) => {
  let els = [...componentEl.querySelectorAll('.ql-size .ql-picker-options .ql-picker-item')]
  let fontSize = actions.fontSize + 'px'
  let findIndex = els.findIndex(el => {
    if (el.dataset.value === fontSize) {
      return el
    }
  })
  findIndex--
  if (findIndex < 0) {
    findIndex = 0
  }
  els[findIndex] && els[findIndex].click()
  actions.fontSize = parseInt(els[findIndex].dataset.value)
  requestAnimationFrame(() => {
    try {
      example.focus()
    } catch (e) {
      console.log(e.message)
    }
  })
}

// 加粗，斜体，下划线
export const fontStyleChange = (event, componentEl, actions, example, record) => {
  let elMap = {
    bold: componentEl.querySelector('.ql-bold'),
    italic: componentEl.querySelector('.ql-italic'),
    underline: componentEl.querySelector('.ql-underline'),
  }
  let clickType = record.value
  elMap[clickType].click()
  if (actions.fontStyle.includes(clickType)) {
    let k = actions.fontStyle.indexOf(clickType)
    actions.fontStyle.splice(k, 1)
  } else {
    actions.fontStyle.push(clickType)
  }
}

// 列表操作
export const listingChange = (event, componentEl, actions, example, record) => {
  let elMap = {
    bullet: componentEl.querySelector('.ql-list[value="bullet"]'),
    ordered: componentEl.querySelector('.ql-list[value="ordered"]'),
  }
  let clickType = record.value
  elMap[clickType].click()
  if(clickType === actions.listing){
    actions.listing = null;
  }else{
    actions.listing = clickType
  }
}

// 水平对齐
export const alignChange = (event, componentEl, actions, example, record) => {
  let options = componentEl.querySelectorAll('.ql-align .ql-picker-item')
  let elMap = {
    left: options[0],
    center: options[1],
    right: options[2],
  }
  let clickType = record.value
  elMap[clickType].click()
  actions.align = clickType
}

// selectionChange
export const selectionChange = (componentEl, actions, [ range, oldRange, source ]) => {
  // 根据不同行 (p) 的对其方式设置选中状态
  let alignOptions = [...componentEl.querySelectorAll('.ql-align .ql-picker-item')]
  let alignNumMap = ['left', 'center', 'right']
  let align = alignOptions.findIndex(el => {
    let classList = el.className.split(' ')
    if (classList.includes('ql-selected')) return el
  })
  actions.align = alignNumMap[align]

  //列表回显
  let listingOptions = [...componentEl.querySelectorAll('.ql-list')]
  let listingInfo = listingOptions.find(el => {
    let classList = el.className.split(' ')
    if (classList.includes('ql-active')) return el
  })
  if (listingInfo) {
    actions.listing = listingInfo.value
  } else {
    actions.listing = null
  }

  // 字体加粗 斜体 下划线回显
  let fontStyleOption = [componentEl.querySelector('.ql-bold'), componentEl.querySelector('.ql-italic'), componentEl.querySelector('.ql-underline')]
  actions.fontStyle = fontStyleOption.map(el => {
    let classList = el.className.split(' ')
    if (classList.includes('ql-active')) return el.getAttribute('aria-label')
  })
}

// 禁用状态（阅读）
export const disabledInput = (props,componentEl) =>{
  if(componentEl.value){
    let editorInput = componentEl.value.querySelector('.ql-editor');
    if(editorInput){
      if(props.disabled){
        editorInput.setAttribute('contenteditable',true)
      }else{
        editorInput.removeAttribute('contenteditable')
      }
    }
  }
}
