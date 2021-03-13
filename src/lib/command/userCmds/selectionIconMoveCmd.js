import { handleGetNewSelect } from '../util';
import { showSelectionBg } from '../../selectionBg/util';

export default function selectionIconMoveCmd(pos, type, startSelect, endSelect, modelStore, appStore, selectionStore) {
  const curSelect = type === 'left' ? startSelect : endSelect;
  const otherSelect = type === 'left' ? endSelect : startSelect;
  const newFocus = handleGetNewSelect(pos, curSelect.text, modelStore);
  const [newStartSelect, newEndSelect] = handleNewSelection(newFocus, otherSelect, type, modelStore, appStore);

  if (!newStartSelect || !newEndSelect) return;
  const betweenSections = 
    modelStore.findBetweenSectionsByTwoIds(newStartSelect.id, newEndSelect.id);
  selectionStore.setSelectionBySelects(newStartSelect, newEndSelect, betweenSections);
  showSelectionBg(selectionStore);
}

function handleNewSelection(newFocus, otherSelect, type, modelStore, appStore) {
  if (!newFocus) return [];
  const ohterOffset = type === 'left' ? otherSelect.endOffset : otherSelect.startOffset;
  let startSelect, endSelect;
  const focusIdx = modelStore.children.findIndex(item => item.id === newFocus.id);
  const otherIdx = modelStore.children.findIndex(item => item.id === otherSelect.id);
  // 说明是当前section
  if (newFocus.id === otherSelect.id) {
    let startOffset, endOffset;
    if (newFocus.offset < ohterOffset) {
      appStore.setTouchType('left');
      startOffset = newFocus.offset;
      endOffset = ohterOffset;
    } else {
      appStore.setTouchType('right');
      startOffset = ohterOffset;
      endOffset = newFocus.offset;
    }
    startSelect = {
      id: newFocus.id,
      text: newFocus.text,
      type: 'side',
      startOffset,
      endOffset
    }
    endSelect = startSelect;
  // 上一个section，说明newFocus比otherSelect前
  } else if (focusIdx < otherIdx) {
    appStore.setTouchType('left');
    startSelect = {
      id: newFocus.id,
      text: newFocus.text,
      type: 'start',
      startOffset: newFocus.offset,
      endOffset: newFocus.text.children.length
    }
    endSelect = {
      id: otherSelect.id,
      text: otherSelect.text,
      type: 'end',
      startOffset: 0,
      endOffset: ohterOffset
    }
  // 下一个section，说明newFocus比otherSelect后
  } else if (focusIdx > otherIdx) {
    appStore.setTouchType('right');
    startSelect = {
      id: otherSelect.id,
      text: otherSelect.text,
      type: 'start',
      startOffset: ohterOffset,
      endOffset: otherSelect.text.children.length
    }
    endSelect = {
      id: newFocus.id,
      text: newFocus.text,
      type: 'end',
      startOffset: 0,
      endOffset: newFocus.offset
    }
  }
  return [startSelect, endSelect];
}
