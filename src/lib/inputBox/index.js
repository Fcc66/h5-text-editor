import { getTouchPos, textInput  } from './util';
import './index.css';
import { throtte } from '../commonUtil';
import { useRef, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import Command from '../command';

// 输入层，主要拦截用户键盘和鼠标的操作，调用命令
function InputBox(props) {
  // 命令器，输入层交给命令器去执行命令
  let command;
  const textareaRef = useRef(null);
  let timer = null;

  useEffect(() => {
    inputEventsOn();
    return function eventsOff() {
      inputEventsOff();
    }
  });

  function inputEventsOn() {
    touchEventsOn();
    keyEventsOn();
    textareaEventsOn();
  }
  
  function inputEventsOff() {
    touchEventsOff();
    keyEventsOff();
  }

  function textareaEventsOn() {
    textInput(textareaRef.current, e => {
      e.data && command.input(e.data);
    });
  }

  function keyEventsOn() {
    document.addEventListener('keydown', handleKeydown);
  }

  function keyEventsOff() {
    document.removeEventListener('keydown', handleKeydown);
  }
  
  function touchEventsOn() {
    const container = document.getElementById('container');
    container.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
  }
  
  function touchEventsOff() {
    const container = document.getElementById('container');
    container.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    container.removeEventListener('touchend', handleTouchMove);
  }

  function handleKeydown(e) {
    // 回车键
    if (e.keyCode === 13) {
      command.pressEnter();
    // 删除键
    } else if (e.keyCode === 8) {
      command.pressBack();
    }
  }
  
  function handleTouchStart(e) {
    timer = setTimeout(function(){
      // 此处为长按事件
      timer = null;
      const pos = getTouchPos(e);
      command.longTouch(props.modelStore.children, pos);
    }, 500);
    textareaRef.current.focus();
  }
  
  function handleTouchMove(e) {
    if (props.appStore.touchType === 'none') {
      clearTimeout(timer);
      timer = 0;
    }
    const pos = getTouchPos(e);
    command.touchMove(pos);
  }

  handleTouchMove = throtte(handleTouchMove, 40);
  
  function handleTouchEnd(e) {
    clearTimeout(timer);
    if(timer !== 0 && timer !== null){
      // 此处为点击事件
      timer = null;
      const pos = getTouchPos(e);
      command.click(props.modelStore.children, pos);
    }
    e.preventDefault();
    return false;
  }

  function onRef(ref) {
    command = ref;
  }

  return (
    <>
      <Command onRef={ onRef }></Command>
      <textarea ref={ textareaRef } className="hidden-textarea"></textarea>
    </>
  )
}

export default inject('modelStore', 'selectionStore', 'appStore')(observer(InputBox));
