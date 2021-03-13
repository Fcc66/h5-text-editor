import './index.css';
import Text from '../text';
import { inject, observer } from 'mobx-react';

function Container(props) {
  return (
    <div id="container">
      { props.modelStore.children.map(text => 
          <Text key={ text.id } text={ text }></Text>) }
    </div>
  );
}

export default inject('modelStore')(observer(Container));
