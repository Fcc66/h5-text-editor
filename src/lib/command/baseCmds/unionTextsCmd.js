import operateUtil from '../../operate';

export default function unionTextsCmd(text, beforeText, parentSection) {
  if (!beforeText) return [];
  const beforeOffset = beforeText.children.length;
  const [operate1, invert1] = operateUtil.getInsertOperate(beforeText, beforeOffset, text.children);
  const [operate2, invert2] = operateUtil.getDeleteOperate(text, 0, text.children.length);
  const operateList = [operate1, operate2];
  const invertList = [invert1, invert2];
  return [operateList, invertList];
}
