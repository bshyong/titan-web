import Routes from './routes/index.js.jsx'
import Router from 'react-router'
import React from 'react'

Router.run(Routes, Router.HistoryLocation, (Handler) => {
  React.render(<Handler />, document.body)
})
