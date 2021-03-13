import { checkRects } from '../text/util';
import { getRandomId } from '../commonUtil';
import operateUtil from '../operate';
// 游标y和光标y的距离
const Y_DIFF = 15; 

export function handleGetNewSelect(pos, text, modelStore) {
  // cursorPos为修正的坐标，因为真正判断移动的是光标，而pos是icon
  const cursorPos = {
    x: pos.x,
    y: pos.y - Y_DIFF
  }
  let newSelect = checkRects(cursorPos, text);
  let nextSection;
  // 没有在当前找到
  if (!newSelect) {
    nextSection = modelStore.findBeforeSection(text.id);
    if (nextSection) {
      newSelect = checkRects(cursorPos, nextSection);
    }
    // 没有在上一个找到
    if (!newSelect) {
      nextSection = modelStore.findAfterSection(text.id);
      if (nextSection) {
        newSelect = checkRects(cursorPos, nextSection);
      }
    }
  }
  return newSelect;
}

// 获取新的letter文字
export function getNewLetter(data) {
  const id = getRandomId();
  const letter = {
    id,
    content: data.content,
    type: 'letter',
    marks: data.marks
  }
  
  return letter;
}

// 处理letter的样式增删覆盖
export function handleMarks(letters, type, value) {
  const specialType = ['bold', 'italic', 'underline'];
  if (specialType.includes(type)) {
    handleLetterSpecialMarks(letters, type);
  } else {
    handleLetterCommonMarks(letters, type, value);
  }
}

// 处理特殊的样式，有可能需要取反的样式
function handleLetterSpecialMarks(letters, type) {
  const isIncludeAll = letters.every(letter => letter.marks.includes(type));
  // 如果全部都包含了该type，取反，去掉该type
  if (isIncludeAll) {
    letters.forEach(letter => {
      const i = letter.marks.findIndex(mark => mark === type);
      letter.marks.splice(i, 1);
    });
  // 不是全部包含，把没有的补进去
  } else {
    letters.forEach(letter => {
      if (!letter.marks.includes(type)) letter.marks.push(type);
    });
  }
}

// 处理普通的样式
function handleLetterCommonMarks(letters, type, value) {
  let markStr;
  switch(type) {
    case 'fontSize':
      markStr = `fontSize: ${value}px`;
      break;
    case 'color':
      markStr = `color: ${value}`;
      break;
    case 'backgroundColor':
      markStr = `backgroundColor: ${value}`;
      break;
  }
  letters.forEach(letter => {
    const i = letter.marks.findIndex(mark => mark.indexOf(type) > -1);
    if (i > -1) {
      letter.marks[i] = markStr;
    } else {
      letter.marks.push(markStr);
    }
  });
}

// 设置样式，重新替换letters
export function replaceLettersByStyle(selects, type, value) {
  if (!selects) return [];

  let operateList, invertList;
  selects.forEach(select => {
    const { startOffset, endOffset, text } = select;
    const list = text.children;
    const selectedLetters = list.slice(startOffset, endOffset);
    const source = JSON.parse(JSON.stringify(list));
    handleMarks(selectedLetters, type, value);
    const [operate, invert] = operateUtil.getReplaceOperate(text, startOffset, selectedLetters, source);
    operateList = [operate];
    invertList = [invert];
  });
  return [operateList, invertList];
}

// 设置样式，重新替换text
export function replaceTextsByStyle(selects, type, modelStore) {
  if (!selects) return [];

  const texts = selects.map(select => select.text);
  const source = JSON.parse(JSON.stringify(modelStore.children));
  texts.forEach(text => {
    text.marks = handleInPairMarks(text.marks, type);
  });
  const firstText = texts[0];
  const firstOffset = modelStore.children.findIndex(section => section.id === firstText.id);
  const [operate, invert] = operateUtil.getReplaceOperate(modelStore, firstOffset, texts, source);
  const operateList = [operate];
  const invertList = [invert];
  return [operateList, invertList];
}

function handleInPairMarks(marks, type) {
  const map = {
    indent: 'redent',
    redent: 'indent',
    alignLeft: 'alignRight',
    alignRight: 'alignLeft'
  }
  if (!marks.includes(type)) {
    marks.push(type);
    if (marks.includes(map[type])) {
      const index = marks.findIndex(mark => mark === map[type]);
      marks.splice(index, 1);
    }
  }
  return marks;
}
