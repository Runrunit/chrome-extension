import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './components/App'
import OpenedTasksPage from './components/OpenedTasksPage'
import ClosedTasksPage from './components/ClosedTasksPage'

export default () => {
  return (
    <Route path='/' component={App}>
      <IndexRoute component={OpenedTasksPage} />
      <Route path='/opened-tasks' component={OpenedTasksPage} />
      <Route path='/closed-tasks' component={ClosedTasksPage} />
    </Route>
  )
}
