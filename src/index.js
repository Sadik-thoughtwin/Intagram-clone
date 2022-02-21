import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './Components/Login'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store/index'

ReactDOM.render(
  <React.StrictMode>
   <Provider store = { store }>
   <Router>
        <Routes>
          <Route exact path="/" element={<Login />}/>
          <Route path="/home" element={<App />}/>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
