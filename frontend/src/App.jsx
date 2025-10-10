// frontend-vite/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Transactions from './pages/Transactions.jsx';
import Budgets from './pages/Budgets.jsx';
import Header from './components/Header.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { ToastContainer } from 'react-toastify'; // <-- 1. Import Container
import 'react-toastify/dist/ReactToastify.css'; // <-- 2. Import CSS

function App() {
    return (
        <Router>
            <div className='max-w-7xl mx-auto p-4 min-h-screen flex flex-col'> {/* Added flex-col and min-h-screen for proper footer positioning */}
                <Header />
                
                {/* Main Content Area */}
                <main className='flex-grow'> 
                    <Routes>
                        {/* Public Routes */}
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />

                        {/* Private Routes (Wrapped in PrivateRoute) */}
                        <Route element={<PrivateRoute />}>
                            <Route path='/' index element={<Dashboard />} />
                            <Route path='/transactions' element={<Transactions />} />
                            <Route path='/budgets' element={<Budgets />} />
                        </Route>
                    </Routes>
                </main>
                
                {/* Add the Footer here */}
                <footer className='py-4 mt-8 border-t border-gray-200 text-center text-sm text-gray-500'>
                    &copy; {new Date().getFullYear()} SpendWise by RJ Tech
                </footer>
                
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </div>
        </Router>
    );
}

export default App;