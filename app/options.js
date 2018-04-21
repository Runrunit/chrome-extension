import React from 'react';
import { render } from 'react-dom';
import OptionsPage from './components/OptionsPage';

const appContainer = document.getElementById('runrunTMApp');

import routes from './routes';

render(<OptionsPage />, appContainer)