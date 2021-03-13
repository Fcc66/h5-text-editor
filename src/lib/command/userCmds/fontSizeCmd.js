import { replaceLettersByStyle } from '../util';
import { showSelectionBg } from '../../selectionBg/util'; 

export default function fontSizeCmd(selectionStore, modelStore, value) {
  const selects = selectionStore.selects;
  const [operateList, invertList] = replaceLettersByStyle(selects, 'fontSize', value);
  operateList.forEach(operate => modelStore.excuteOperate(operate));
  showSelectionBg(selectionStore);
  return invertList;
}