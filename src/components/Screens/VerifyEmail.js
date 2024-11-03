import React from 'react'
import { useRef, useState } from 'react';
import "./VerifyEmail.css"
import Login from './Login';



function VerifyEmail() {

    const valueRef = useRef('');

    return (
        <div>
            <div className='verifyEmail'>
                <h1>Please verify your email address</h1>
                <p>An email verification link sent to your email address {valueRef.userEmail}, to verify your email click on that link. </p>
                <h2>Thankyou.</h2>
            </div>
        </div>
    )
}

export default VerifyEmail;