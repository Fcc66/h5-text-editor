import './App.css';
import { useEffect } from 'react';
import Container from './lib/container';
import Tabbar from './lib/tabbar';
import InputBox from './lib/inputBox';
import React from 'react';
import { Provider } from 'mobx-react';
import stores from './lib/store';
import storage from './lib/storage';

function App() {
  useEffect(() => {
    storage.getLastNote();
  });

  return (
    <div id="editor">
      <Provider {...stores}>
        <Tabbar></Tabbar>
        <Container></Container>
        <InputBox></InputBox>
      </Provider>
    </div>
  );
}

export default App;
