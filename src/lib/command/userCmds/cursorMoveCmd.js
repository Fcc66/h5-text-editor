import { handleGetNewSelect } from '../util';
import cursor from '../../cursor';

export default function cursorMoveCmd(pos, select, modelStore, selectionStore) {
  const newFocus = handleGetNewSelect(pos, select.text, modelStore);
  if (!newFocus) return;
  let startSelect, endSelect;
  startSelect = endSelect = {
    id: newFocus.id,
    text: newFocus.text,
    type: 'side',
    startOffset: newFocus.offset,
    endOffset: newFocus.offset
  }
  selectionStore.setSelectionBySelects(startSelect, endSelect);
  cursor.show(newFocus.rect);
}