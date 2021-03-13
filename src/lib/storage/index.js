import modelStore from '../store/model';
import appStore from '../store/app';

const storage = {
  list: [],
  saveNote() {
    let dataStr = localStorage.getItem('editorData');
    let data;
    let list = [];
    let title;
    // storage里存在列表
    if (dataStr) {
      data = JSON.parse(dataStr);
      list = data.list || [];
      const index = list.findIndex(data => data.id === modelStore.id);
      // 列表里有它
      if (index > -1) {
        title = `记事本${index+1}`;
        list[index] = {
          id: modelStore.id,
          title,
          model: modelStore
        }
      // 列表里没有，push进去
      } else {
        title = `记事本${list.length+1}`;
        list.push({
          id: modelStore.id,
          title,
          model: modelStore
        });
        this.getNoteTitleList(list);
      }
    // storage里不存在列表
    } else {
      list.push({
        id: modelStore.id,
        title: '记事本1',
        model: modelStore
      });
      this.getNoteTitleList(list);
    }
    data = {
      list,
      lastNote: {
        title,
        model: modelStore
      }
    }
    this.list = list;
    dataStr = JSON.stringify(data);
    localStorage.setItem('editorData', dataStr);
  },
  getNote(id) {
    const dataStr = localStorage.getItem('editorData');
    if (dataStr) {
      const data = JSON.parse(dataStr);
      const list = data.list || [];
      const note = list.find(item => item.id === id);
      const { model } = note;
      modelStore.updateModel(model);
    }
  },
  getLastNote() {
    const dataStr = localStorage.getItem('editorData');
    if (dataStr) {
      const data = JSON.parse(dataStr);
      const lastNote = data.lastNote;
      modelStore.updateModel(lastNote.model);
    }
  },
  getNoteTitleList(list) {
    list = list || this.list;
    if (list.length === 0) {
      let dataStr = localStorage.getItem('editorData');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        list = data.list;
      }
    }
    const noteTitleList = list.map(item => {
      return {
        id: item.id,
        title: item.title
      }
    });
    return noteTitleList;
  },
}

export default storage;
