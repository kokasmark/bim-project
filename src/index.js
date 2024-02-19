import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './Dashboard';
import CustomerDashboard from './CustomerDashboard';
import SignUpPage from './SignUpPage';
import SignInWrapper from './SignInPage';
import { getCookie } from './cookie';
import ForgotPasswordWrapper from './ForgotPasswordPage';
import ManageWrapper from './ManagePage'
const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
  <BrowserRouter >
  <Routes>
    <Route exact={true} path="/" element={<App />} />
    <Route exact={true} path="/orders" element={<CustomerDashboard />} />
    <Route exact={true} path="/offers" element={<Dashboard />} />
    <Route exact={true} path="/manage" element={<ManageWrapper />} />

    <Route exact={true} path="/signup" element={<SignUpPage />} />
    <Route exact={true} path="/signin" element={<SignInWrapper />} />

    <Route exact={true} path="/forgot-password" element={<ForgotPasswordWrapper/>} />
  </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
