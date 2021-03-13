import insert from '../baseCmds/insertCmd';
import deleteRangeSelectText from '../baseCmds/deleteRangeSelectTextCmd';

export default function inputCmd(data, selectionStore, modelStore) {
  let invertListRes = [];
  const invertList = deleteRangeSelectText(selectionStore, modelStore);
  invertListRes = invertList;
  const [operate, invert] = insert(data, selectionStore.startSelect);
  modelStore.excuteOperate(operate);
  selectionStore.go(data.length);
  invertListRes.push(invert);
  return invertListRes;
}