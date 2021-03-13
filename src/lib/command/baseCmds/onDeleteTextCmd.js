import operateUtil from '../../operate';

export default function onDeleteTextCmd(selects, parentSection) {
  const operateList = [];
  const invertList = [];
  let operate, invert;
  selects.forEach(item => {
    const text = item.text;
    if (item.type === 'start' || item.type === 'end' || item.type === 'side') {
      const offset = item.startOffset;
      const num = item.endOffset - item.startOffset;
      [operate, invert] = operateUtil.getDeleteOperate(text, offset, num);
    } else if (item.type === 'middle') {
      const offset = parentSection.children.findIndex(section => section.id === item.id);
      [operate, invert] = operateUtil.getDeleteOperate(parentSection, offset, 1);
    }
    operateList.push(operate);
    invertList.push(invert);
  });
  return [operateList, invertList];
}