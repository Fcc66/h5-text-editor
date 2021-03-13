import { replaceLettersByStyle } from '../util';

export default function colorCmd(selectionStore, modelStore, value) {
  const selects = selectionStore.selects;
  const [operateList, invertList] = replaceLettersByStyle(selects, 'color', value);
  operateList.forEach(operate => modelStore.excuteOperate(operate));
  return invertList;
}