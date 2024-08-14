'use client'
import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import toast from 'react-hot-toast';
import Link from 'next/link';
import { styles } from '@/app/styles/styles';
import { useLoginMutation } from '@/app/redux/features/auth/authApi';
import { signIn } from 'next-auth/react';

const schema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email!")
        .required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!").min(8, "Password must be at least 8 characters"),
});

const Login = ({ setRoute, setOpen }) => {
    const [show, setShow] = useState(false);
    const [login, { isSuccess, error }] = useLoginMutation();

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            await login({ email, password })
        },
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success("Login Sucessfully!");
            setOpen(false);
        }
        if (error) {
            if ('data' in error) {
                const message = error.data.message;
                toast.error(message);
            }
        }
    }, [isSuccess, error]);

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 p-4" onClick={() => setOpen(false)}>
            <div className='relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md p-4 max-h-screen overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                <div className='flex flex-col gap-4 p-6'>
                    <h4 className={styles.title}>Sign In</h4>
                    <p className="mb-1 text-base text-gray-700">
                        Enter your email and password to Sign In.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-6">
                            <h6 className={styles.label} htmlFor="email">
                                Your Email
                            </h6>
                            <div className="mt-5 relative mb-1 h-11 w-full min-w-[200px]">
                                <input
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    id="email"
                                    className={`${errors.email && touched.email && "border-red-500"} ${styles.input
                                        }`}
                                    placeholder=" "
                                />
                                <label className={styles.label_input}>
                                    Email
                                </label>
                                {errors.email && touched.email && (
                                    <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group mb-6">
                            <h6 className={styles.label} htmlFor="password">
                                Your Password
                            </h6>
                            <div className="mt-5 relative mb-1 h-11 w-full min-w-[200px]">
                                <input
                                    type={show ? "text" : "password"}
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    id="password"
                                    className={`${errors.password && touched.password && "border-red-500"} ${styles.input
                                        }`}
                                    placeholder=" "
                                />
                                <label className={styles.label_input}>
                                    Password
                                </label>
                                {show ? (
                                    <AiOutlineEye
                                        className="absolute right-2 top-3 h-5 w-5 cursor-pointer"
                                        onClick={() => setShow(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-2 top-3 h-5 w-5 cursor-pointer"
                                        onClick={() => setShow(true)}
                                    />
                                )}
                                {errors.password && touched.password && (
                                    <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-6 flex items-center justify-end">
                            <Link href="#" >
                                Forgot password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className={`${styles.button} mt-4`}
                            value="Login"
                        >
                            Sign In
                        </button>
                        <div className='mb-4'>
                            <h5 className="block py-2 font-sans text-sm antialiased font-semibold leading-relaxed uppercase text-blue-gray-900 opacity-70 text-center">
                                OR
                            </h5>
                            <ul className="flex flex-col gap-1 mt-2 -ml-2">
                                <button className="mb-2 flex w-full cursor-pointer select-none items-center justify-center gap-2 rounded-md px-2 py-2 text-start leading-tight shadow-md outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                                    onClick={() => signIn("facebook")}
                                >
                                    <FaFacebookF className="w-5 h-5" />
                                    <h6 className="block font-Roboto text-sm antialiased font-semibold leading-relaxed tracking-normal uppercase text-blue-gray-900">
                                        Signin with Facebook
                                    </h6>
                                </button>
                                <button className="mb-2 flex w-full cursor-pointer select-none items-center justify-center gap-2 rounded-md px-2 py-2 text-start leading-tight shadow-md outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                                    onClick={() => signIn("google")}
                                >
                                    <FaGoogle className="w-5 h-5 rounded-md" />
                                    <h6 className="block font-Roboto text-sm antialiased font-semibold leading-relaxed tracking-normal uppercase text-blue-gray-900">
                                        Signin with Google
                                    </h6>
                                </button>
                            </ul>
                        </div>

                        <p className="flex justify-center mt-4 text-sm text-inherit">
                            Don't have an account?{''}
                            <span className="ml-1 font-bold text-blue-gray-900 cursor-pointer"
                                onClick={() => setRoute("SignUp")}>
                                Sign up
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
