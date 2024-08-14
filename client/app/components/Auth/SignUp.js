'use client'
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { styles } from '@/app/styles/styles';
import toast from "react-hot-toast";
import { useRegisterMutation } from "@/app/redux/features/auth/authApi";

const schema = Yup.object().shape({
    name: Yup.string().required("Please enter your name!"),
    email: Yup.string()
        .email("Invalid email!")
        .required("Please enter your email!"),
    phoneNumber: Yup.string()
        .matches(/^[0-9]+$/, "Phone number must be only digits")
        .min(10, "Phone number must be at least 10 digits!")
        .max(15, "Phone number can't be longer than 15 digits!"),
    password: Yup.string()
        .required("Please enter your password!")
        .min(8, "Password must be at least 8 characters!"),
});

const SignUp = ({ setRoute, setOpen }) => {
    const [show, setShow] = useState(false);
    const [register, { data, isSuccess, error }] = useRegisterMutation();

    useEffect(() => {
        if (isSuccess) {
            const message = data?.message || "Registration Successfully!";
            toast.success(message);
            setRoute("Verification");
        }
        if (error) {
            if ('data' in error) {
                const message = error.data.message;
                toast.error(message);
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    }, [isSuccess, error])

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phoneNumber: "",
            password: "",
        },
        validationSchema: schema,
        onSubmit: async ({ name, email, phoneNumber, password }) => {
            const data = {
                name,
                email,
                phoneNumber,
                password,
            };
            await register(data);
        },
    });
    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 p-4" onClick={() => setOpen(false)}>
            <div className='relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md p-4 max-h-screen overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                <div className='flex flex-col gap-4 p-6'>
                    <h4 className={styles.title}>Sign Up</h4>
                    <p className="mb-1 text-base text-gray-700">
                        Join to ELP
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-6">
                            <h6 className={styles.label} htmlFor="name">
                                Your Name
                            </h6>
                            <div className="mt-5 relative mb-1 h-11 w-full min-w-[200px]">
                                <input
                                    type="text"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    id="name"
                                    className={`${errors.name && touched.name && "border-red-500"} ${styles.input}`}
                                    placeholder=" "
                                />
                                <label className={styles.label_input}>
                                    Name
                                </label>
                                {errors.name && touched.name && (
                                    <span className="text-red-500 text-sm mt-1 block">{errors.name}</span>
                                )}
                            </div>
                        </div>
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
                            <h6 className={styles.label} htmlFor="email">
                                Your Phone Number
                            </h6>
                            <div className="mt-5 relative mb-1 h-11 w-full min-w-[200px]">
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={values.phoneNumber}
                                    onChange={handleChange}
                                    id="phoneNumber"
                                    className={`${errors.email && touched.email && "border-red-500"} ${styles.input
                                        }`}
                                    placeholder=" "
                                />
                                <label className={styles.label_input}>
                                    Phone Number
                                </label>
                                {errors.phoneNumber && touched.phoneNumber && (
                                    <span className="text-red-500 text-sm mt-1 block">{errors.phoneNumber}</span>
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
                        <button
                            type="submit"
                            className={`${styles.button} mt-4`}
                            value="Sign Up"
                        >
                            Sign Up
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
                            Already have an account?{''}
                            <span className="ml-1 font-bold text-blue-gray-900 cursor-pointer"
                                onClick={() => setRoute('Login')}>
                                Sign in
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
