import onDeleteTextCmd from './onDeleteTextCmd';
import unionTextsCmd from './unionTextsCmd';
import { hideSelectionBg } from '../../selectionBg/util';

export default function deleteRangeSelectTextCmd(selectionStore, modelStore) {
  let [operateList, invertList] = onDeleteTextCmd(selectionStore.selects, modelStore);
  operateList.forEach(operate => modelStore.excuteOperate(operate));
  hideSelectionBg();
  if (selectionStore.selects.length === 1) {
    selectionStore.goto(
      selectionStore.startSelect.text,
      selectionStore.startSelect.startOffset
    );
  } else {
    selectionStore.goto(selectionStore.endSelect.text, 0);
    const text = selectionStore.startSelect.text;
    const beforeText = modelStore.findBeforeSection(text.id);
    const [operateList2, invertList2] = unionTextsCmd(text, beforeText, modelStore); 
    invertList = invertList.concat(invertList2);
    selectionStore.goto(beforeText, beforeText.children.length);
    operateList2.forEach(operate => modelStore.excuteOperate(operate));
  }
  return invertList;
}