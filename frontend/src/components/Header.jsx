// frontend-vite/src/components/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    return (
        <header className='flex justify-between items-center py-4 mb-6 border-b border-gray-200'>
            <div className='logo'>
              <Link to='/' className='text-2xl font-bold text-blue-600'>💸 SpendWise</Link>
            </div>
            <ul className='flex items-center space-x-5'>
                {user ? (
                    <>
                        <li><Link to='/transactions' className='text-gray-700 hover:text-blue-600 font-medium'>Transactions</Link></li>
                        <li><Link to='/budgets' className='text-gray-700 hover:text-blue-600 font-medium'>Budgets</Link></li>
                        <li>
                            <button className='px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition' onClick={onLogout}>
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to='/login' className='px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition'>Login</Link></li>
                        <li><Link to='/register' className='px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'>Register</Link></li>
                    </>
                )}
            </ul>
        </header>
    );
}

export default Header;