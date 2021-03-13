import operateUtil from '../../operate';
import { getNewLetter } from '../util';

export default function insert(data, select) {
  if (!select) return null;
  const offset = select.startOffset;
  const text = select.text;
  const list = getLetterList(data);
  const [operate, invert] = operateUtil.getInsertOperate(text, offset, list);
  return [operate, invert];
}

function getLetterList(data) {
  let list = [];
  for(let i = 0; i < data.length; i++) {
    const letter = getNewLetter({
      content: data[i],
      marks: []
    });
    list.push(letter)
  }
  return list;
}

