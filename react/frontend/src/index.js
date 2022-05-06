import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from 'react';
import ReactDOM from 'react-dom';

import Awards from './routes/Awards';
import Client from './routes/Client';
import Host from './routes/Host';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route element={<Client />} path="/" />
      <Route element={<Awards />} path="/awards" />
      <Route element={<Host />} path="/host" />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

/**
 * If you want to start measuring performance in your app, pass a function
 * to log results (for example: reportWebVitals(console.log))
 * or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 */
reportWebVitals();
