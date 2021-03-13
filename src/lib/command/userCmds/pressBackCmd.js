import unionTextsCmd from '../baseCmds/unionTextsCmd';
import deleteRangeSelectTextCmd from '../baseCmds/deleteRangeSelectTextCmd';
import operateUtil from '../../operate';

export default function pressBackCmd(selectionStore, modelStore) {
  const { startOffset: offset, text } = selectionStore.startSelect;
  let invertList;
  if (selectionStore.isCollapsed) {
    // 和上一段合并
    if (offset === 0) {
      const beforeText = modelStore.findBeforeSection(text.id);
      const offset = beforeText.children.length;
      const [operateList, _invertList] = unionTextsCmd(text, beforeText, modelStore);
      operateList.forEach(operate => modelStore.excuteOperate(operate));
      selectionStore.goto(beforeText, offset);
      invertList = _invertList;
    // 删除文字
    } else {
      const { text, startOffset: offset } = selectionStore.startSelect;
      const [operate, invert] = operateUtil.getDeleteOperate(text, offset-1, 1);
      invertList = [invert];
      modelStore.excuteOperate(operate);
      selectionStore.go(-1);
    }
  // 删除范围选择的文字
  } else {
    invertList = deleteRangeSelectTextCmd(selectionStore, modelStore);
  }
  return invertList;
}