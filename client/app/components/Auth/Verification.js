'use client'
import { useActivationMutation } from '@/app/redux/features/auth/authApi';
import { styles } from '@/app/styles/styles';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { useSelector } from 'react-redux';

const Verification = ({ setRoute, setOpen }) => {
    const { token } = useSelector((state) => state.auth);
    const [activation, { isSuccess, error }] = useActivationMutation();

    useEffect(() => {
        if (isSuccess) {
            const message = "Account activated successful!";
            toast.success(message);
            setRoute("Login");
        }
        if (error) {
            if ('data' in error) {
                const message = error.data.message;
                toast.error(message);
                setInvalidError(true)
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    }, [isSuccess, error]);

    const [invalidError, setInvalidError] = useState(false);
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];
    const [verifyNumber, setVerifyNumber] = useState({
        "0": "",
        "1": "",
        "2": "",
        "3": "",
    });
    const verifyHandler = async () => {
        const verificationNumber = Object.values(verifyNumber).join("");
        if (verificationNumber.length !== 4) {
            setInvalidError(true);
            return;
        };
        await activation({
            activation_token: token,
            activation_code: verificationNumber,
        });
    };
    const handleInputChange = (index, value) => {
        setInvalidError(false);
        if (/^[0-9]?$/.test(value)) {
            const newVerifyNumber = { ...verifyNumber, [index]: value };
            setVerifyNumber(newVerifyNumber);

            if (value === "" && index > 0) {
                inputRefs[index - 1].current?.focus();
            } else if (value.length === 1 && index < 3) {
                inputRefs[index + 1].current?.focus();
            }
        }
    };
    return (
        <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 p-4" onClick={() => setOpen(false)}>
            <div className='relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md p-4 max-h-screen overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                <div className='flex flex-col gap-4'>
                    <h4 className={styles.title}>Verify Your Account</h4>
                    <p className="mb-1 text-base text-gray-700">
                        Enter your verify number to Sign Up.
                    </p>
                    <div className='flex items-center justify-center mt-2 mb-2'>
                        <div className='w-[60px] h-[60px] rounded-full bg-black text-white flex items-center justify-center'>
                            <VscWorkspaceTrusted size={30} />
                        </div>
                    </div>
                    <div className='m-auto flex items-center justify-around'>
                        {Object.keys(verifyNumber).map((key, index) => (
                            <input
                                type='number'
                                className={`w-[60px] h-[60px] ml-3 bg-transparent border-[3px] rounded-[10px] flex items-center justify-center text-[18px] text-black outline-none text-center 
                                    ${invalidError ? "shake border-red-500" : "border-black"}`}
                                key={index}
                                ref={inputRefs[index]}
                                placeholder=''
                                value={verifyNumber[key]}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                maxLength={1}
                            />
                        ))}
                    </div>
                    <div className='w-full flex justify-center mt-2'>
                        <button
                            className={styles.button}
                            onClick={verifyHandler}>
                            Verify
                        </button>
                    </div>
                    <p className="flex justify-center mt-4 text-sm text-inherit">
                        Go back to Sign in?{''}
                        <span className="ml-1 font-bold text-blue-gray-900 cursor-pointer"
                            onClick={() => setRoute('Login')}>
                            Sign in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Verification;
