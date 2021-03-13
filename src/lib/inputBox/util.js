// 获取手指接触的坐标
export function getTouchPos(e) {
  let touchs = [];
  if (e.touches && e.touches.length > 0) {
    touchs = e.touches;
  } else if (e.changedTouches && e.changedTouches.length > 0) {
    touchs = e.changedTouches;
  }
  const touch = touchs.length && touchs[0] || {};
  return {
    x: touch.pageX || 0,
    y: touch.pageY || 0
  };
}

// 处理文字输入，包括中文的处理
export function textInput(el, cb) {
  if (typeof el === 'string') {
    el = document.querySelector(el);
  }
  let isChineseInput = false;
  el.addEventListener('input', e => {
    if (!isChineseInput) {
      cb && cb.call(this, e);
    }
  });

  el.addEventListener('compositionstart', e => {
    isChineseInput = true;
  })

  el.addEventListener('compositionend', e => {
    isChineseInput = false;
    cb && cb.call(this, e);
  })
}
