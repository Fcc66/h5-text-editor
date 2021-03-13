import './index.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// render了不能通过reject和observer注入
import stores from '../store';

// 选区背景
class SelectionBg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      leftIconStyle: {},
      rightIconStyle: {},
      allBlocks: []
    }
  }
  show(firstRect, lastRect, allBlocks) {
    if (!firstRect || !lastRect) return;
    const leftIconStyle = {
      top: firstRect.bottom + 'px',
      left: firstRect.left - 24 + 'px',
    }
    const rightIconStyle = {
      top: lastRect.bottom + 'px',
      left: lastRect.right - 6 + 'px',
    }

    this.setState({
      visible: true,
      leftIconStyle,
      rightIconStyle,
      allBlocks
    })
  }
  hide() {
    this.setState({
      visible: false,
    })
  }
  onLeftIconTouchStart(e) {
    stores.appStore.setTouchType('left');
  }
  onLeftIconTouchEnd(e) {
    stores.appStore.setTouchType('none');
  }
  onRightIconTouchStart(e) {
    stores.appStore.setTouchType('right');
  }
  onRightIconTouchEnd(e) {
    stores.appStore.setTouchType('none');
  }
  render() {
    return (
      <>
        { 
          this.state.visible &&
          <>
            { this.state.allBlocks.map((block, i) => 
              <div key={ i } className="selectBgBlock"
              style={{
                top: block.top,
                left: block.left,
                height: block.height,
                width: block.width,
              }}></div>
            ) }
            <i className="selectBgLeftIcon iconfont icon-cursor"
              onTouchStart={ this.onLeftIconTouchStart }
              onTouchEnd={ this.onLeftIconTouchEnd }
              style={ this.state.leftIconStyle }></i>
            <i className="selectBgRightIcon iconfont icon-cursor"
              onTouchStart={ this.onRightIconTouchStart }
              onTouchEnd={ this.onRightIconTouchEnd }
              style={ this.state.rightIconStyle }></i>
          </> 
        }
      </>
    )
  }
}

let div = document.createElement('div');
document.body.appendChild(div);
let selectionBg = ReactDOM.render(<SelectionBg />, div);
export default selectionBg
