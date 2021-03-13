import './index.css';
import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Slider, Drawer, List, ActionSheet } from 'antd-mobile';
import Command from '../command';
import storage from '../storage';
import cursor from '../cursor';
import { hideSelectionBg } from '../selectionBg/util';
const { showActionSheetWithOptions: showActionSheet } = ActionSheet;

let command;
class Tabbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerVisible: false
    }
  }
  getStyleContents() {
    const contents = [
      <div className="bar-item-box" key={1}>
        <i className="iconfont icon-bold"
          onClick={  this.setBold }></i>
        <i className="iconfont icon-italic"
          onClick={  this.setItalic }></i>
        <i className="iconfont icon-underline"
          onClick={  this.setUnderline }></i>
        <i className="iconfont icon-indent-increase"
          onClick={ this.setIndent }></i>
        <i className="iconfont icon-indent-decrease"
          onClick={ this.setRedent }></i>
        <i className="iconfont icon-align-left"
          onClick={ this.setAlignLeft }></i>
        <i className="iconfont icon-align-right"
          onClick={ this.setAlignRight }></i>
      </div>,
      <div style={{ 'minHeight': '50px' }} key={2}>
        <p className="sub-title">Aa</p>
        <Slider
          style={{ marginLeft: 30, marginRight: 30 }}
          defaultValue={ 16 }
          min={ 12 }
          max={ 30 }
          onChange={ this.setFontSize }
        />
      </div>,
      <div className="bar-item-box" key={3}>
        <div className="color-dot" style={{ backgroundColor: '#000000' }}
          onClick={ () => { this.setColor('#000000') } }></div>
        <div className="color-dot" style={{ backgroundColor: '#7FFF00' }}
          onClick={ () => { this.setColor('#7FFF00') } }></div>
        <div className="color-dot" style={{ backgroundColor: '#D2691E' }}
          onClick={ () => { this.setColor('#D2691E') } }></div>
        <div className="color-dot" style={{ backgroundColor: '#DC143C' }}
          onClick={ () => { this.setColor('#DC143C') } }></div>
        <div className="color-dot" style={{ backgroundColor: '#8B008B' }}
          onClick={ () => { this.setColor('#8B008B') } }></div>
        <div className="color-dot" style={{ backgroundColor: '#1E90FF' }}
          onClick={ () => { this.setColor('#1E90FF') } }></div>
        <div className="color-dot" style={{ backgroundColor: '#FFD700' }}
          onClick={ () => { this.setColor('#FFD700') } }></div>
      </div>,
      <div className="bar-item-box" key={4}>
        <div className="back-ground-rect" style={{ backgroundColor: '#ffffff' }}
          onClick={ () => { this.setBackgroundColor('#ffffff') } }></div>
        <div className="back-ground-rect" style={{ backgroundColor: '#F5F5DC' }}
          onClick={ () => { this.setBackgroundColor('#F5F5DC') } }></div>
        <div className="back-ground-rect" style={{ backgroundColor: '#8FBC8F' }}
          onClick={ () => { this.setBackgroundColor('#8FBC8F') } }></div>
        <div className="back-ground-rect" style={{ backgroundColor: '#E6E6FA' }}
          onClick={ () => { this.setBackgroundColor('#E6E6FA') } }></div>
        <div className="back-ground-rect" style={{ backgroundColor: '#FFB6C1' }}
          onClick={ () => { this.setBackgroundColor('#FFB6C1') } }></div>
      </div>
    ]
    return contents;
  }
  setFontSize(value) {
    command.fontSize(value);
  }
  setColor(value) {
    command.color(value);
  }
  setBackgroundColor(value) {
    command.backgroundColor(value);
  }
  setBold() {
    command.bold();
  }
  setItalic() {
    command.italic();
  }
  setUnderline() {
    command.underline();
  }
  setIndent() {
    command.indent();
  }
  setRedent() {
    command.redent();
  }
  setAlignLeft() {
    command.alignLeft();
  }
  setAlignRight() {
    command.alignRight();
  }
  onRef(ref) {
    command = ref;
  }
  onDrawerOpenChange() {
    this.setState({ drawerVisible: !this.state.drawerVisible });
  }
  addNote() {
    this.props.modelStore.createNewModel();
    cursor.hide();
    hideSelectionBg();
    this.props.selectionStore.clearSelection();
  }
  onApplyUndo() {
    command.undo();
  }
  onApplyRedo() {
    command.redo();
  }
  openNoteList() {
    const noteList = storage.getNoteTitleList();
    const BUTTONS = noteList.map(note => note.title);
    showActionSheet({
      options: BUTTONS,
      message: '选择记事本',
      maskClosable: true,
    },
    (buttonIndex) => {
      // 中间可能有新增过，拿最新的
      const noteList = storage.getNoteTitleList();
      const note = noteList[buttonIndex];
      if (note) {
        const id = note.id;
        storage.getNote(id);
        cursor.hide();
        hideSelectionBg();
      }
    });
  }
  render() {
    return (
      <div className="toolbar">
        <div className="tabbar-left">
          <i className="header-icon iconfont icon-plus"
            onClick={ () => { this.addNote() } }></i>
          <i className="header-icon iconfont icon-ellipsis-vertical"
            onClick={ () => { this.openNoteList() } }></i>
        </div>
        <div className="tabbar-right">
          <i className="header-icon iconfont icon-editor-undo"
            style={{ color: this.props.undoStore.undo.length > 0 ? '#000000' : '#cccccc' }}
            onClick={ () => { this.onApplyUndo() } }></i>
          <i className="header-icon iconfont icon-editor-redo"
            style={{ color: this.props.undoStore.redo.length > 0 ? '#000000' : '#cccccc' }}
            onClick={ () => { this.onApplyRedo() } }></i>
          <i className="header-icon iconfont icon-editor-font-color" onClick={() => {
            this.onDrawerOpenChange()
          }}></i>
        </div>
        <Drawer
          className="my-drawer"
          position="bottom"
          contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
          sidebar={ this.getStyleContents() }
          open={ this.state.drawerVisible }
          onOpenChange={ () => { this.onDrawerOpenChange() } }
        >
          <></>
        </Drawer>
        <Command onRef={ this.onRef }></Command>
      </div>
    );
  }
}

export default inject('modelStore', 'selectionStore', 'appStore', 'undoStore')(observer(Tabbar));
