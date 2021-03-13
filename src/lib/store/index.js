import modelStore from './model.js';
import selectionStore from './selection.js';
import appStore from './app.js';
import undoStore from './undo';

const stores = {
  modelStore,
  selectionStore,
  appStore,
  undoStore
};
/// 默认导出接口
export default stores;
