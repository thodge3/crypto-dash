import React from 'react';
import './App.css';
import styled, { css } from 'styled-components';

import AppLayout from './AppLayout';
import AppBar from './AppBar';
import { AppProvider } from './AppProvider';
import Settings from '../Settings';
import Content from '../Shared/Content';

function App() {
  return (
    <AppLayout>
      <AppProvider>
        <AppBar />
        <Content>
          <Settings /> 
        </Content>
      </AppProvider>
    </AppLayout>
  );
}

export default App;
