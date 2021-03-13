import { getRandomId } from '../commonUtil';
const IS_TEXT_NODE = 3;

// 获取每个文字的rect
export function getTextRects(node) {
  if (!node) return [];
  const rects = [];
  const selection = document.getSelection();
  const range = document.createRange();
  selection.addRange(range);
  let textIdx = 0;;
  for (let i = 0; i < node.childNodes.length; i++) {
    let child = node.childNodes[i];
    while (child.nodeType !== IS_TEXT_NODE) {
      child = child.childNodes[0];
    }
    // 文字节点，一个文字节点包括多个文字
    if (child.nodeType === IS_TEXT_NODE) {
      for (let j = 0; j < child.length; j++) {
        range.setStart(child, j);
        range.setEnd(child, j+1);
        const rect = range.getBoundingClientRect();
        rects[textIdx++] = {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height
        };
      }
    }
  }
  return rects;
}

export function getCursorRectByOffset(id, offset) {
  const node = document.getElementById(id);
  const cursorRects = getCursorRect(node);
  return cursorRects[offset];
}

// 获取文字间隙的rect
export function getCursorRect(node) {
  let rects = getTextRects(node);
  rects = transRect(rects);
  // 如果文字内容为空，获取段落的
  if (rects.length === 0) {
    rects = getEmptyTextRect(node);
  }
  return rects;
}

// 获取空段落的rect
function getEmptyTextRect(node) {
  if (!node) return [];
  const rect = node.getBoundingClientRect();
  const rects = [];
  rects.push({
    top: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
    height: rect.height || 16,
    width: 1,
  });
  return rects;
}

// 把文字的rect转成光标的rect
function transRect(rects) {
  if (rects.length === 0) return [];

  const res = [];
  const firstItem = rects[0];
  res.push({
    top: firstItem.top,
    bottom: firstItem.bottom,
    left: firstItem.left,
    right: firstItem.left,
    height: firstItem.height,
  });

  rects.forEach(item => {
    res.push({
      top: item.top,
      bottom: item.bottom,
      left: item.right,
      right: item.right,
      height: item.height,
      width: 1
    })
  });
  return res
}

// 验证pos是否在自己领域的rects中
export function checkRects(pos, text) {
  const node = document.getElementById(text.id);
  if (!checkInitialRect(pos, node)) {
    return null;
  }
  return checkDetailRects(pos, node, text);
}

// 初步检查rect，如果初步检查不过，没必要到详细检查了
function checkInitialRect(pos, node) {
  const elemRect = node.getBoundingClientRect();
  if (!elemRect) return false;
  if (pos.y > elemRect.top && pos.y < elemRect.bottom) {
    return true;
  } else {
    return false;
  }
}

// 详细地检查rect
function checkDetailRects(pos, node, text) {
  const { x, y } = pos;
  const rects = getCursorRect(node);
  let newFocusRect; 
  let newFocus = {
    id: text.id,
    text
  };
  // 某一行里的最左边和最右边
  let minLeft, maxRight;
  for (let j = 0; j < rects.length-1; j++) {
    const rect = rects[j];
    const nextRect = rects[j+1];
    let whichRectType = null;
    // 如果高度在这个rect之间
    if (y >= rect.top && y <= rect.bottom) {
      maxRight = rect;
      maxRight.offset = j;
      whichRectType = inWhichRect(pos, rect, nextRect);
    }
    
    if (whichRectType === 'rect') {
      newFocusRect = {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        height: rect.height,
      }
      newFocus.offset = j;
    } else if (whichRectType === 'nextRect') {
      newFocusRect = {
        left: nextRect.left,
        top: nextRect.top,
        right: rect.right,
        bottom: rect.bottom,
        height: nextRect.height,
      }
      newFocus.offset = j+1;
    }
  }
  // 如果都没有找到，就要考虑minLeft和maxRight
  // 先补齐
  if (!newFocusRect) {
    const firstRect = rects[0];
    const lastRect = rects[rects.length-1];
    if (y >= firstRect.top && y <= firstRect.bottom) {
      minLeft = firstRect;
    }
    if (y >= lastRect.top && y <= lastRect.bottom) {
      maxRight = lastRect;
      maxRight.offset = rects.length-1;
    }
    // 横坐标比最左的还小
    if (minLeft && x < minLeft.left) {
      newFocusRect = {
        left: minLeft.left,
        top: minLeft.top,
        right: minLeft.right,
        bottom: minLeft.bottom,
        height: minLeft.height,
      }
      newFocus.offset = 0;
    }
    // 横坐标比最右的还大
    if (maxRight && x > maxRight.left) {
      newFocusRect = {
        left: maxRight.left,
        top: maxRight.top,
        right: maxRight.right,
        bottom: maxRight.bottom,
        height: maxRight.height,
      }
      newFocus.offset = maxRight.offset;
    }
  }
  
  newFocus.rect = newFocusRect;
  return newFocusRect ? newFocus : null;
}

// 光标在这个rect之间还是在下个rect之间
function inWhichRect(pos, rect, nextRect) {
  const { x, y } = pos;

  // 如果高度在下一个rect之间
  if (y >= nextRect.top && y <= nextRect.bottom) {
    // 横坐标在这个rect的范围
    if ((x >= rect.left) && (x < (rect.left + nextRect.left) / 2)) {
      return 'rect';
    }
    // 横坐标在下一个rect的范围
    if ((x < nextRect.left) && (x >= (rect.left + nextRect.left) / 2)) {
      return 'nextRect';
    }
  }
  return null;
}

export function getPieces(list) {
  if (!list.length) return [];
  const pieces = [];

  const id = getRandomId();
  let item = {
    id,
    type: 'piece',
    content: list[0].content,
    marks: list[0].marks
  }
  for(let i = 1; i < list.length; i++) {
    if (isArrayEqual(list[i].marks, list[i-1].marks)) {
      item.content += list[i].content;
    } else {
      pieces.push(item);
      const id = getRandomId();
      item = {
        id,
        type: 'piece',
        content: list[i].content,
        marks: list[i].marks
      }
    }
  }
  pieces.push(item);
  return pieces;
}

// 两个简单数组（不含复杂对象）是否相等
function isArrayEqual(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;
  arr1.sort((a, b) => a - b);
  arr2.sort((a, b) => a - b);
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
