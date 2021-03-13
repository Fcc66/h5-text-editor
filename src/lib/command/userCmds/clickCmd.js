import { checkRects } from '../../text/util';
import cursor from '../../cursor';
import selectionBg from '../../selectionBg';

export default function clickCmd(texts, pos, selectionStore) {
  if (!texts || texts.length === 0) return null;

  const selects = selectionStore.selects;
  selectionBg.hide();
  let newFocus;
  texts.forEach(text => {
    const res = checkRects(pos, text);
    if (res) newFocus = res;
  });
  let selection;
  let rect;
  if (newFocus) {
    rect = newFocus.rect;
    selection = {
      isCollapsed: true,
      selects: [
        {
          id: newFocus.text.id,
          text: newFocus.text,
          type: 'side',
          startOffset: newFocus.offset,
          endOffset: newFocus.offset,
        }
      ]
    }
  // 如果都没有找到，则认为点击第一个text
  } else {
    if (selects.length > 0) return;
    const firstText = texts[0];
    const node = document.getElementById(firstText.id);
    const nodeRect = node.getBoundingClientRect();
    rect = {
      top: nodeRect.top,
      bottom: nodeRect.bottom,
      left: nodeRect.left,
      right: nodeRect.left,
      height: 16
    }
    selection = {
      isCollapsed: true,
      selects: [
        {
          id: firstText.id,
          text: firstText,
          type: 'side',
          startOffset: 0,
          endOffset: 0,
        }
      ]
    }
  }
  cursor.show(rect);

  selection && selectionStore.setSelection(selection);
};