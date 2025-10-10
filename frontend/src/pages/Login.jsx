// frontend-vite/src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify'; // <-- Import toast

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

     useEffect(() => {
        if (isError) { 
            // Replace alert with toast.error
            toast.error(message); 
        }
        if (isSuccess || user) { navigate('/'); }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);


    const onChange = (e) => setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value, }));

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    if (isLoading) { return <h1>Loading...</h1>; }

    return (
        <>
            <section className='text-center mb-8'>
                <h1 className='text-3xl font-bold text-gray-800'>Login</h1>
                <p className='text-gray-500 mt-1'>Welcome back! Sign in to manage your finances</p>
            </section>

            <section className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg'>
                <form onSubmit={onSubmit}>
                    <div className='mb-4'>
                        <input
                            type='email'
                            className='w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Enter your email'
                            onChange={onChange}
                        />
                    </div>
                    <div className='mb-6'>
                        <input
                            type='password'
                            className='w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                            id='password'
                            name='password'
                            value={password}
                            placeholder='Enter password'
                            onChange={onChange}
                        />
                    </div>
                    <div className='mb-4'>
                        <button type='submit' className='w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition'>
                            Login
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}

export default Login;