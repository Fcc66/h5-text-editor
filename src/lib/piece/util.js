import { markMap, DEFAULT_FONT_SIZE } from './config'

// 获取单个的样式
function onGetSingleStyle(data) {
  if (markMap[data]) {
    return markMap[data]
  } else {
    if (data.indexOf('fontSize') > -1) {
      return onGetFontSize(data);
    } else if (data.indexOf('backgroundColor') > -1) {
      return onGetCommonStyle(data);
    } else if (data.indexOf('color') > -1) {
      return onGetCommonStyle(data);
    }
  }
  return {};
}

// 获取字体样式
function onGetFontSize(data) {
  let style = DEFAULT_FONT_SIZE;
  if (data.indexOf(':') > -1) {
    style.fontSize = data.split(':')[1].trim();
  }
  
  return style
}

// 获取普通样式
function onGetCommonStyle(data) {
  if  (data.indexOf(':') > -1) {
    const key = data.split(':')[0].trim();
    const value = data.split(':')[1].trim();
    let style = {
      [key]: value
    }
    return style;
  } else {
    return {}
  }
}

// 获取由mark转换成的style
export function getStyles(marks) {
  let styles = {};
  marks.forEach(item => {
    styles = { ...styles, ...onGetSingleStyle(item) };
  });
  return styles;
}
