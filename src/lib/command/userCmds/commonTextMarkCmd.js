import { replaceTextsByStyle } from '../util';

export default function commonTextMarkCmd(selectionStore, modelStore, type) {
  const selects = selectionStore.selects;
  const [operateList, invertList] = replaceTextsByStyle(selects, type, modelStore);
  operateList.forEach(operate => modelStore.excuteOperate(operate));
  return invertList;
}