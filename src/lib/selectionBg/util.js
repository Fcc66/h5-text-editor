import { getCursorRect, getTextRects } from '../text/util';
import selectionBg from './index';
const BOTTOM_ERROR = 5; // bottom值的误差

export function showSelectionBg(selection) {
  if (selection.selects.length === 0) return;
  const [firstRect, lastRect] = getSelectionBgTwoSideRect(selection);
  const allBlocks = getSelectionBgBlocks(selection);
  selectionBg.show(firstRect, lastRect, allBlocks);
}

export function hideSelectionBg() {
  selectionBg.hide();
}

// 获取全部select要渲染的背景block
function getSelectionBgBlocks(selection) {
  let allBlocks = [];
  const selects = selection.selects;
  selects.forEach(select => {
    const blocks = getRenderBlocks(select);
    allBlocks = [ ...allBlocks, ...blocks ];
  });
  return allBlocks;
}

// 获取选区背景两个游标的位置
function getSelectionBgTwoSideRect(selection) {
  const selects = selection.selects;
  const firstSelect = selects[0];
  const lastSelect = selects[selects.length-1];
  const firstId = firstSelect.id;
  const lastId = lastSelect.id;
  const firstNode = document.getElementById(firstId);
  const lastNode = document.getElementById(lastId);
  const firstRects = getCursorRect(firstNode);
  const lastRects = getCursorRect(lastNode);
  const firstRect = firstRects[firstSelect.startOffset];
  const lastRect = lastRects[lastSelect.endOffset];
  return [firstRect, lastRect]
}

// 获取每一个select要渲染的背景block
function getRenderBlocks(select) {
  const blockRects = [];
  const selectBlockRects = getSelectBlockRects(select);
  if (!selectBlockRects || !selectBlockRects.length) return [];

  for (let i = 0; i < selectBlockRects.length; i++) {
    let minTopInBlock = Infinity;
    const rectsInBlock = selectBlockRects[i];
    const len = rectsInBlock.length;
    for (let j = 0; j < len; j++) {
      minTopInBlock = Math.min(minTopInBlock, rectsInBlock[j].top);
    }
    const firstRect = rectsInBlock[0];
    const lastRect = rectsInBlock[len-1];
    blockRects.push({
      top: minTopInBlock,
      left: firstRect.left,
      width: lastRect.right - firstRect.left,
      height: firstRect.bottom - minTopInBlock,
    })
  }
  return blockRects;
}

// 获取选择的以行区分的offset
function getSelectBlockRects(select) {
  const selectTextRects = getSelectTextRects(select);
  
  const selectBlockRects = handleGetBlockRects(selectTextRects);
  return selectBlockRects;
}

// 获取整段文字的光标的blockRects
export function getWholeTextCursorBlockRects(node) {
  const textRects = getCursorRect(node);
  const blockRects = handleGetBlockRects(textRects);
  return blockRects;
}

// 处理获取blockRects
function handleGetBlockRects(textRects) {
  if (!textRects || !textRects.length) return [];

  const blockRects = [];
  let item = [];
  const len = textRects.length;
  for (let i = 0; i < len-1; i++) {
    const rect = textRects[i];
    const nextRect = textRects[i+1];
    item.push(rect);
    if (Math.abs(rect.bottom - nextRect.bottom) > BOTTOM_ERROR) {
      blockRects.push(item);
      item = [];
    }
  }
  item.push(textRects[len-1]);
  blockRects.push(item);
  return blockRects;
}

// 获取选择的文字rects
function getSelectTextRects(select) {
  const { startOffset, endOffset } = select;
  const node = document.getElementById(select.id);
  const textRects = getTextRects(node);
  return textRects.slice(startOffset, endOffset);
}
