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
const root = ReactDOM.createRoot(document.getElementById('root'));

const isAdmin = false;

root.render(
  <BrowserRouter >
  <Routes>
    <Route exact={true} path="/" element={<App />} />
    <Route exact={true} path="/dashboard" element={isAdmin == true ? <Dashboard /> : <CustomerDashboard />} />
    <Route exact={true} path="/admin_dashboard" element={<Dashboard />} />

    <Route exact={true} path="/signup" element={<SignUpPage />} />
    <Route exact={true} path="/signin" element={<SignInWrapper />} />
  </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
