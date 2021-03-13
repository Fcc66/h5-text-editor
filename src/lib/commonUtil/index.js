export function throtte(fn, delay) {
  let timer;
  return function() {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, delay);
    }
  }
}

export function getRandomId() {
  var s = [];
  var hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  let id = s.join("");
  return id;
}

export function findItemInTreeById(tree, id) {
  if (!tree || id === undefined) return;
  if (tree.id === id) return tree;
  if (!tree.children) return;
  for (let i = 0; i < tree.children.length; i++) {
    const res = findItemInTreeById(tree.children[i], id);
    if (res) return res;
  }
}
