import { replaceLettersByStyle } from '../util';

export default function backgroundColorCmd(selectionStore, modelStore, value) {
  const selects = selectionStore.selects;
  const [operateList, invertList] = replaceLettersByStyle(selects, 'backgroundColor', value);
  operateList.forEach(operate => modelStore.excuteOperate(operate));
  return invertList;
}