import { observable, action } from 'mobx';
import operateUtil from '../operate';
import { getRandomId, findItemInTreeById } from '../commonUtil';

const containerId = getRandomId();
const textId = getRandomId();
const modelStore = observable({
  id: containerId,
  type: 'container',
  children: [
    {
      type: 'text',
      id: textId,
      marks: [],
      children: [],
    }
  ]
});

modelStore.ins = action(() => {
  modelStore.timer++;
})

modelStore.setSection = action(section => {
  modelStore.children = modelStore.children.map(item => item.id === section.id ? section : item);
});

modelStore.findBeforeSection = action(id => {
  const idx = modelStore.children.findIndex(item => item.id === id);
  const targetIdx = idx - 1;
  return targetIdx < -1 ?
    null : modelStore.children[targetIdx];
});

modelStore.findAfterSection = action(id => {
  const idx = modelStore.children.findIndex(item => item.id === id);
  const targetIdx = idx + 1;
  return targetIdx > modelStore.children.length ?
    null : modelStore.children[targetIdx];
});

modelStore.findBetweenSectionsByTwoIds = action((id1, id2) => {
  const list = modelStore.children;
  let isEnter = false;
  const res = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id1) {
      isEnter = true;
      continue;
    }
    if (list[i].id === id2) break;
    if (isEnter) {
      res.push(list[i]);
    }
  }
  return res;
});

modelStore.excuteOperate = action(operate => {
  if (!operate) return;
  const{ id, opts } = operate;
  const section = findItemInTreeById(modelStore, id);
  if (!section) return;
  operateUtil.handleExecuteOperate(section, opts);
  modelStore.children = [...modelStore.children];
});

modelStore.createNewModel = action(() => {
  const containerId = getRandomId();
  const textId = getRandomId();
  const newText = {
    type: 'text',
    id: textId,
    marks: [],
    children: [],
  }
  modelStore.id = containerId;
  modelStore.children = [newText];
});

modelStore.updateModel = action(model => {
  modelStore.id = model.id;
  modelStore.children = model.children;
});

export default modelStore;
