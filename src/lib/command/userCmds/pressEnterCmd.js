import deleteRangeSelectTextCmd from '../baseCmds/deleteRangeSelectTextCmd'
import splitTextCmd from '../baseCmds/splitTextCmd';

export default function pressEnterCmd(selectionStore, modelStore) {
  let invertListRes = [];
  const invertList = deleteRangeSelectTextCmd(selectionStore, modelStore);
  invertListRes = invertList;
  const { startSelect: select } = selectionStore;
  const [invertList2, newText] = splitTextCmd(select.text, select.startOffset, modelStore);
  invertListRes = invertListRes.concat(invertList2);
  selectionStore.goto(newText, 0);
  return invertListRes;
}