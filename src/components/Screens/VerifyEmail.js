import React from 'react'
import { useRef } from 'react';
import "./VerifyEmail.css"
import { useNavigate } from 'react-router-dom';
import Button from "../Functions/Button";



function VerifyEmail() {

    const valueRef = useRef('');
    let navigate = useNavigate();



    function ok() {
        navigate('/login')
    };

    return (
        <div>
            <div className='verifyEmail'>
                <h1>Please verify your email address</h1>
                <p>An email verification link sent to your email address {valueRef.userEmail}, to verify your email click on that link. </p>
                <h2>Thankyou.</h2>
            </div>
            <Button class="btn-btn-success" value="OK" onClick={() => ok()} />
        </div>
    )
}

export default VerifyEmail;