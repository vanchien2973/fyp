import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useLoginMutation } from '@/app/redux/features/auth/authApi';
import { signIn } from 'next-auth/react';
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useLoadUserQuery } from '@/app/redux/features/api/apiSlice';

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email!").required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!").min(8, "Password must be at least 8 characters"),
});

const Login = ({ setRoute, setOpen, open }) => {
    const [show, setShow] = useState(false);
    const [login, { isSuccess, error }] = useLoginMutation();
    const { refetch } = useLoadUserQuery(undefined, {});

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            await login({ email, password });
        },
    });

    useEffect(() => {
        if (isSuccess) {
            refetch();
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
        <>
            <DialogHeader>
                <DialogTitle>Sign In</DialogTitle>
            </DialogHeader>
            <div className='flex flex-col gap-4'>
                <p className="mb-1 text-base text-gray-700">
                    Enter your email and password to Sign In.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-6">
                        <Label className='font-semibold' htmlFor="email">
                            Your Email
                        </Label>
                        <div className="mt-5 relative mb-1 h-11 w-full min-w-[200px]">
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter your email..."
                                value={values.email}
                                onChange={handleChange}
                                id="email"
                                className={`${errors.email && touched.email}`}
                            />
                            {errors.email && touched.email && (
                                <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
                            )}
                        </div>
                    </div>
                    <div className="form-group mb-6">
                        <Label className='font-semibold' htmlFor="password">
                            Your Password
                        </Label>
                        <div className="mt-5 relative mb-1 h-11 w-full min-w-[200px]">
                            <Input
                                type={show ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password..."
                                value={values.password}
                                onChange={handleChange}
                                id="password"
                                className={`${errors.password && touched.password}`}
                            />
                            {show ? (
                                <AiOutlineEye
                                    className="absolute right-2 top-[6px] h-5 w-5 cursor-pointer"
                                    onClick={() => setShow(false)}
                                />
                            ) : (
                                <AiOutlineEyeInvisible
                                    className="absolute right-2 top-[6px] h-5 w-5 cursor-pointer"
                                    onClick={() => setShow(true)}
                                />
                            )}
                            {errors.password && touched.password && (
                                <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>
                            )}
                        </div>
                    </div>
                    <div className="mb-6 flex items-center justify-end">
                        <Link href="#">Forgot password?</Link>
                    </div>
                    <Button type="submit" className="flex w-full justify-center gap-2 px-2 py-2 shadow-md" value="Login">
                        <h5 className="text-sm font-semibold uppercase">
                            Sign In
                        </h5>
                    </Button>

                    <div className="mb-4">
                        <h5 className="block py-2 text-center text-sm font-semibold leading-relaxed uppercase text-gray-700">
                            OR
                        </h5>
                        <ul className="flex flex-col gap-2 mt-2">
                            <Button
                                variant="outline"
                                className="flex w-full justify-center gap-2 px-2 py-2 shadow-md"
                                onClick={() => signIn("facebook")}
                            >
                                <FaFacebookF className="w-4 h-4" />
                                <h5 className="text-sm font-semibold uppercase">
                                    Sign in with Facebook
                                </h5>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex w-full justify-center gap-2 px-2 py-2 shadow-md"
                                onClick={() => signIn("google")}
                            >
                                <FaGoogle className="w-4 h-4" />
                                <h5 className="text-sm font-semibold uppercase">
                                    Sign in with Google
                                </h5>
                            </Button>
                        </ul>
                    </div>

                    <p className="flex justify-center mt-4 text-sm">
                        Don't have an account?{" "}
                        <span
                            className="ml-1 font-bold text-blue-500 cursor-pointer"
                            onClick={() => setRoute("SignUp")}
                        >
                            Sign up
                        </span>
                    </p>

                </form>
            </div>
        </>
    );
};

export default Login;
