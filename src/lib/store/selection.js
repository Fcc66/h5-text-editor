import { observable, action, computed } from 'mobx';
import { getCursorRectByOffset } from '../text/util';
import cursor from '../cursor';

class SelectionStore {
  @observable
  isCollapsed = false;

  @observable
  selects = [];

  @action
  setSelection(selection) {
    self.isCollapsed = selection.isCollapsed;
    self.selects = selection.selects;
  }

  @action
  clearSelection() {
    self.setSelection({
      isCollapsed: false,
      selects: []
    })
  }

  // 根据开始select和结束select，计算新的selection
  @action
  setSelectionBySelects(startSelect, endSelect, betweenSection = []) {
    if (!startSelect || !endSelect) return;
    // 开始和结束是同一个section
    if (startSelect.id === endSelect.id) {
      self.isCollapsed = startSelect.startOffset === startSelect.endOffset;
      self.selects = [startSelect];
    } else {
      const betweenSelects = betweenSection.map(item => {
        return {
          id: item.id,
          text: item,
          type: 'middle',
          startOffset: 0,
          endOffset: item.children.length
        }
      })
      self.isCollapsed = false;
      self.selects = [startSelect, ...betweenSelects, endSelect];
    }
  }

  @action
  go(num) {
    // 聚焦光标才能前进或后退
    if (!self.isCollapsed || self.selects.length === 0) return;
    const select = self.startSelect;
    select.startOffset = select.endOffset = select.startOffset + num;
    self.updateCursor();
  }

  // 折叠去某一个焦点
  @action
  goto(text, offset) {
    this.isCollapsed = true;
    this.selects = [{
      id: text.id,
      text,
      type: 'side',
      startOffset: offset,
      endOffset: offset
    }];
    self.updateCursor();
  }

  @computed
  get startSelect() {
    return self.selects.find(select => select.type === 'start' || select.type === 'side');
  }

  @computed
  get endSelect() {
    return self.selects.find(select => select.type === 'end' || select.type === 'side');
  }

  updateCursor() {
    const { id, startOffset: offset } = this.startSelect;
    const cursorRect = getCursorRectByOffset(id, offset);
    cursor.show(cursorRect);
  }
}

const self = new SelectionStore();

export default self;
