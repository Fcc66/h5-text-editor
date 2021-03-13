import './index.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// render了不能通过reject和observer注入
import stores from '../store';

class Cursor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cursorVisible: false,
      cursorStyle: {}
    }
  }
  show(rect) {
    if (!rect) return;
    const cursorStyle = {
      top: rect.top + 'px',
      left: rect.left + 'px',
      height: rect.height + 'px'
    }
    const iconStyle = {
      top: rect.bottom + 'px',
      left: rect.left - 14 + 'px',
    }
    this.setState({
      cursorVisible: true,
      cursorStyle,
      iconStyle
    });
  }
  hide() {
    this.setState({
      cursorVisible: false
    });
  }
  onCursorTouchStart(e) {
    stores.appStore.setTouchType('cursor');
  }
  onCursorTouchEnd(e) {
    stores.appStore.setTouchType('none');
  }
  render() {
    return (
      <>
        { 
          this.state.cursorVisible && 
          <>
            <span className="cursor" style={ this.state.cursorStyle }></span>
            <i className="cursorIcon iconfont icon-cursor"
              onTouchStart={ this.onCursorTouchStart }
              onTouchEnd={ this.onCursorTouchEnd }
              style={ this.state.iconStyle }></i>
          </>
        }
      </>
    )
  }
}

let div = document.createElement('div');
document.body.appendChild(div);
let cursor = ReactDOM.render(<Cursor />, div);
export default cursor;
