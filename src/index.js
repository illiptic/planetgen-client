import React from 'react';
import { render } from 'react-dom';
import App from './app/App';

require('./main.less')

render(
  <App />,
  document.getElementById('root')
)
