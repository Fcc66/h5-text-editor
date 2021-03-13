import { observable, action } from 'mobx';

const appStore = observable({
  touchType: 'none'
})

appStore.setTouchType = action(touchType => {
  appStore.touchType = touchType;
});

export default appStore;
