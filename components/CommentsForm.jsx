import React, { useState, useEffect, useRef } from 'react';
import { submitComment } from '../services';

const CommentsForm = ({ slug }) => {

    const [error, setError] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [state, setState] = useState({
        name: '', 
        email: '',
        comment: '',
        storeData: false
    });


    useEffect(() => {
        const name = window.localStorage.getItem('name') || '';
        const email = window.localStorage.getItem('email') || '';
        setState(prev => ({
            ...prev,
            name, 
            email
        }))
    },[]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({
            ...prev,
            [name]: name !== 'storeData' ? value : e.target.checked
        }));
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError(false);
        const { name, email, comment } = state;
        const commentObj = { name, email, comment, slug };

        if(state.storeData){
            window.localStorage.setItem('name', name);
            window.localStorage.setItem('email', email);
        }

        const res = await submitComment(commentObj);
        if(res){
            setSuccessMessage(true);
            setTimeout(() => setSuccessMessage(false), 3000);
        }
    }


    return (
        <form className='bg-white shadow-lg rounded-lg p-8 pb-12 mb-8' onSubmit={handleSubmit}>
            <h3 className='text-xl mb-8 font-semibold border-b pb-4'>Comment</h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <textarea placeholder='comment' name='comment'required onChange={handleChange} value={state.comment}
                    className='p-4 outline-none w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-200 text-gray-700'
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder='name' name='name' required value={state.name}  onChange={handleChange}
                    className='py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-200 text-gray-700'
                />
                <input type="text" placeholder='email' name='email' required value={state.email}  onChange={handleChange}
                    className='py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-200 text-gray-700'
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                    <input type="checkbox" name='storeData' checked={state.storeData}  onChange={handleChange}/>
                    <label className='tetx-gray-500 cursor-pointer ml-2' htmlFor='toreData'>Save the e-mail and name</label>
                </div>
            </div>
            {error && <p className='text-xs text-red-500'>All fields are required</p>}
            <div className="mt-8">
                <button className='transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg rounded-full text-white px-8 py-3 coursor-pointer'
                    type='submit'
                >
                    Post Comment
                </button>
                {successMessage && <span className='text-lg float-rigth font-semibold text-green-500'>Comment submitted for review</span>}
            </div>
        </form>
    )
}

export default CommentsForm
