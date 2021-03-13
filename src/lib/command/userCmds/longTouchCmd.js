import { checkRects } from '../../text/util';
import { showSelectionBg } from '../../selectionBg/util';
import cursor from '../../cursor';

export default function longTouchCmd(texts, pos, selectionStore) {
  cursor.hide();
  let newFocus;
  texts.forEach(text => {
    const res = checkRects(pos, text);
    if (res) newFocus = res;
  });
  let selection;
  if (newFocus) {
    const startOffset = newFocus.offset - 1 < 0 ?
      0 : newFocus.offset - 1;
    const endOffset = newFocus.offset + 1 > newFocus.text.children.length ?
      newFocus.text.children.length : newFocus.offset + 1;
    selection = {
      isCollapsed: false,
      selects: [
        {
          id: newFocus.text.id,
          text: newFocus.text,
          type: 'side',
          startOffset,
          endOffset,
        }
      ]
    }
    showSelectionBg(selection);
  }
  selection && selectionStore.setSelection(selection);
}
