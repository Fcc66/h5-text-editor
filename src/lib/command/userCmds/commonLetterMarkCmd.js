import { replaceLettersByStyle } from '../util';

export default function commonLetterMarkCmd(selectionStore, modelStore, type) {
  const selects = selectionStore.selects;
  const [operateList, invertList] = replaceLettersByStyle(selects, type);
  operateList.forEach(operate => modelStore.excuteOperate(operate));
  return invertList;
}