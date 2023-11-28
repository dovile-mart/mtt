import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (sessionStorage.getItem("jwt")){
    config.headers.Authorization=`${sessionStorage.getItem("jwt")}`
  }

  return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
)
