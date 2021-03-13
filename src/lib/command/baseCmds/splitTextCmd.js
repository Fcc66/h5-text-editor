import operateUtil from '../../operate';
import { getRandomId } from '../../commonUtil';

export default function splitTextCmd(text, offset, modelStore) {
  const list = text.children;
  const [operate1, invert1] = operateUtil.getDeleteOperate(text, offset, list.length-offset);
  const restPart = list.slice(offset);
  const newText = getNewText(restPart);
  const textOffset = modelStore.children.findIndex(item => item.id === text.id);
  const [operate2, invert2] = operateUtil.getInsertOperate(modelStore, textOffset+1, [newText]);
  const operateList = [operate1, operate2];
  const invertList = [invert1, invert2];
  operateList.forEach(operate =>  modelStore.excuteOperate(operate));
  return [invertList, newText];
}

function getNewText(children) {
  return {
    id: getRandomId(),
    type: 'text',
    marks: [],
    children: children || []
  }
}