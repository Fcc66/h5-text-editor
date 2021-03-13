const operateUtil = {
  // 获取插入的操作
  getInsertOperate(section, index, arr) {
    const list = section.children;
    const operate = {
      id: section.id,
      opts: []
    }
    if (index > 0) {
      operate.opts.push({
        retain: index
      });
    }
    operate.opts.push({
      insert: arr
    });
    if (list.length - (index+1) > 0) {
      operate.opts.push({
        retain: list.length - index
      });
    }
    const invert = this.invert(list, operate);
    return [operate, invert];
  },
  // 获取删除的操作
  getDeleteOperate(section, index, num) {
    const list = section.children;
    const operate = {
      id: section.id,
      opts: []
    }
    if (index > 0) {
      operate.opts.push({
        retain: index
      });
    }
    operate.opts.push({
      delete: num
    });
    if (list.length - (index+num) > 0) {
      operate.opts.push({
        retain: list.length - (index+num)
      });
    }
    const invert = this.invert(list, operate);
    return [operate, invert];
  },
  // 获取替换的操作
  getReplaceOperate(section, index, arr, source) {
    const list = section.children;
    const operate = {
      id: section.id,
      opts: []
    }
    if (index > 0) {
      operate.opts.push({
        retain: index
      });
    }
    operate.opts.push({
      replace: arr
    });
    if (list.length - (index+1) > 0) {
      operate.opts.push({
        retain: list.length - (index+1)
      });
    }
    const invert = this.invert(source, operate);
    return [operate, invert];
  },
  handleExecuteOperate(section, opts) {
    if (!section) return;

    let index = 0;
    opts.forEach(opt => {
      let [[key, value]] = Object.entries(opt);
      switch (key) {
        case 'retain':
          index += Number(value);
          break;
        case 'delete':
          section.children.splice(index, Number(value));
          break;
        case 'insert':
          value = Array.isArray(value) ? value : Array(value);
          section.children.splice(index, 0, ...value);
          break;
        case 'replace':
          value = Array.isArray(value) ? value : Array(value);
          const n = value.length;
          section.children.splice(index, n, ...value);
          break;
        default:
          break;
      }
    });
  },
  invert(list, operate) {
    var strIndex = 0;
    var inverse = {
      id: operate.id,
      opts: []
    };
    var opts = operate.opts;
    for (var i = 0, l = opts.length; i < l; i++) {
      var opt = opts[i];
      const [key, value] = this.getOptKeyAndValue(opt);
      if (key === 'retain') {
        inverse.opts.push(opt);
        strIndex += value;
      } else if (key === 'insert') {
        inverse.opts.push({
          delete: value.length
        });
      } else if (key === 'replace') {
        inverse.opts.push({
          replace: list.slice(strIndex, strIndex + value.length)
        })
      } else { // delete opt
        inverse.opts.push({
          insert: list.slice(strIndex, strIndex + value)
        })
        strIndex += value;
      }
    }
    return inverse;
  },
  getOptKeyAndValue(opt) {
    const [[key, value]] = Object.entries(opt);
    return [key, value];
  },
};

export default operateUtil;
