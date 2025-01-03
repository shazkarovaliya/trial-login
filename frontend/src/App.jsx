import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error';
import Main from './pages/Main';
import Settings from './pages/Settings';
import ReportCategory from './pages/ReportCategory';
import ReportDescription from './pages/ReportDescription';
import BankReport from './pages/BankReport';
import Transfer from './pages/Transfer';

import { UserProvider } from './components/UserContext'; // Import UserProvider

function App() {
  return (
    <div className="App">
      <UserProvider> {/* Wrap the Router with UserProvider */}
        <Router>
          <Routes>
            <Route path='/' element={<Main />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/category/:category" element={<ReportCategory />} />
            <Route path="/description/:description" element={<ReportDescription />} />
            <Route path='/report/bank/:bank' element={<BankReport />} />
            <Route path='/transfer' element={<Transfer />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
