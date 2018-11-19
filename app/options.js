import React from 'react'
import { render } from 'react-dom'
import OptionsPage from './components/OptionsPage'
import routes from './routes'

const appContainer = document.getElementById('runrunTMApp')

render(<OptionsPage />, appContainer)
