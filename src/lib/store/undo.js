import { observable, action, toJS } from 'mobx';
import operateUtil from '../operate';
import { findItemInTreeById } from '../commonUtil';
import modelStore from '../store/model';

const undoStore = observable({
  undo: [],
  redo: []
});

undoStore.pushUndo = action(item => {
  undoStore.undo.push(item);
});

undoStore.pushRedo = action(item => {
  undoStore.redo.push(item);
});

undoStore.applyUndo = action(() => {
  const operateList = undoStore.undo.pop();
  if (!operateList) return;
  const invertList = operateList.map(operate => {
    const section = findItemInTreeById(modelStore, operate.id);
    return operateUtil.invert(section.children, operate);
  })
  undoStore.redo.push(invertList);
  operateList.forEach(operate =>  modelStore.excuteOperate(operate));
});

undoStore.applyRedo = action(() => {
  const operateList = undoStore.redo.pop();
  if (!operateList) return;
  const invertList = operateList.map(operate => {
    const section = findItemInTreeById(modelStore, operate.id);
    return operateUtil.invert(section.children, operate);
  })
  undoStore.undo.push(invertList);
  operateList.forEach(operate =>  modelStore.excuteOperate(operate));
});

export default undoStore;
