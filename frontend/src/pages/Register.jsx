// frontend-vite/src/pages/Register.jsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify'; // <-- Import toast

function Register() {
    // ... (formData, navigate, dispatch declarations remain the same)
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) { 
            // Replace alert with toast.error
            toast.error(message); 
        }
        if (isSuccess || user) { navigate('/'); }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== password2) {
            // Replace alert with toast.error
            toast.error('Passwords do not match');
        } else {
            dispatch(register({ name, email, password }));
        }
    };


    if (isLoading) { return <h1>Loading...</h1>; }

    return (
        <>
            <section className='text-center mb-8'>
                <h1 className='text-3xl font-bold text-gray-800'>Register</h1>
                <p className='text-gray-500 mt-1'>Create your FinTech account</p>
            </section>

            <section className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg'>
                <form onSubmit={onSubmit}>
                    <div className='mb-4'>
                        <input type='text' className='w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500' id='name' name='name' value={name} placeholder='Enter your name' onChange={onChange} />
                    </div>
                    <div className='mb-4'>
                        <input type='email' className='w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500' id='email' name='email' value={email} placeholder='Enter your email' onChange={onChange} />
                    </div>
                    <div className='mb-4'>
                        <input type='password' className='w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500' id='password' name='password' value={password} placeholder='Enter password' onChange={onChange} />
                    </div>
                    <div className='mb-6'>
                        <input type='password' className='w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500' id='password2' name='password2' value={password2} placeholder='Confirm password' onChange={onChange} />
                    </div>
                    <div className='mb-4'>
                        <button type='submit' className='w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition'>
                            Register
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}

export default Register;