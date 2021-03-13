import React, { Component  } from 'react';
import { inject, observer } from 'mobx-react';
import clickCmd from './userCmds/clickCmd';
import longTouchCmd from './userCmds/longTouchCmd';
import cursorMoveCmd from './userCmds/cursorMoveCmd';
import selectionIconMoveCmd from './userCmds/selectionIconMoveCmd';
import inputCmd from './userCmds/inputCmd';
import pressEnterCmd from './userCmds/pressEnterCmd';
import pressBackCmd from './userCmds/pressBackCmd';
import fontSizeCmd from './userCmds/fontSizeCmd';
import colorCmd from './userCmds/colorCmd';
import backgroundColorCmd from './userCmds/backgroundColorCmd';
import commonLetterMarkCmd from './userCmds/commonLetterMarkCmd';
import commonTextMarkCmd from './userCmds/commonTextMarkCmd';
import storage from '../storage';

class Command extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  click(texts, pos) {
    const { selectionStore } = this.props;
    clickCmd(texts, pos, selectionStore);
  }
  longTouch(texts, pos) {
    const { selectionStore } = this.props;
    longTouchCmd(texts, pos, selectionStore);
  }
  touchMove(pos) {
    const { selectionStore, appStore, modelStore } = this.props;
    // 拖动选区左浮标或者右浮标
    if (appStore.touchType === 'left' || appStore.touchType === 'right') {
      selectionIconMoveCmd(
        pos, appStore.touchType, selectionStore.startSelect, selectionStore.endSelect,
        modelStore, appStore, selectionStore
      );
    // 拖动选区右浮标
    } else if (appStore.touchType === 'cursor') {
      cursorMoveCmd(pos, selectionStore.startSelect, modelStore, selectionStore);
    }
  }
  // 用户输入文字
  input(data) {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = inputCmd(data, selectionStore, modelStore);
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  pressEnter() {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = pressEnterCmd(selectionStore, modelStore);
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  pressBack() {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = pressBackCmd(selectionStore, modelStore);
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  fontSize(value) {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = fontSizeCmd(selectionStore, modelStore, value);
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  color(value) {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = colorCmd(selectionStore, modelStore, value);
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  backgroundColor(value) {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = backgroundColorCmd(selectionStore, modelStore, value);
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  bold() {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = commonLetterMarkCmd(selectionStore, modelStore, 'bold');
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  italic() {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = commonLetterMarkCmd(selectionStore, modelStore, 'italic');
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  underline() {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = commonLetterMarkCmd(selectionStore, modelStore, 'underline');
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  indent() {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = commonTextMarkCmd(selectionStore, modelStore, 'indent');
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  redent() {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = commonTextMarkCmd(selectionStore, modelStore, 'redent');
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  alignLeft() {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = commonTextMarkCmd(selectionStore, modelStore, 'alignLeft');
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  alignRight() {
    const { selectionStore, modelStore, undoStore } = this.props;
    const invertList = commonTextMarkCmd(selectionStore, modelStore, 'alignRight');
    undoStore.pushUndo(invertList);
    storage.saveNote();
  }
  undo() {
    this.props.undoStore.applyUndo();
    storage.saveNote();
  }
  redo() {
    this.props.undoStore.applyRedo();
    storage.saveNote();
  }
  render() {
    return <></>
  }
}

export default inject('modelStore', 'selectionStore', 'appStore', 'undoStore')(observer(Command));
