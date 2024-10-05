'use client'
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRegisterMutation } from "@/app/redux/features/auth/authApi";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
        <>
            <DialogHeader>
                <DialogTitle>Sign Up</DialogTitle>
            </DialogHeader>
            <div className='flex flex-col gap-4'>
                <p className="mb-1 text-base text-gray-700">
                    Join to ELP
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-6">
                        <Label htmlFor="name">Your Name</Label>
                        <div className="mt-5 relative mb-1 h-11 w-full min-w-[200px]">
                            <Input
                                type="text"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                id="name"
                                className={errors.name && touched.name ? "border-red-500" : ""}
                                placeholder="Enter your name"
                            />
                        </div>
                        {errors.name && touched.name && (
                            <span className="text-red-500 text-sm">{errors.name}</span>
                        )}
                    </div>

                    <div className="form-group mb-6">
                        <Label htmlFor="email">Your Email</Label>
                        <div className="mt-5 relative mb-1 h-11 w-full min-w-[200px]">
                            <Input
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                id="email"
                                className={errors.email && touched.email ? "border-red-500" : ""}
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && touched.email && (
                            <span className="text-red-500 text-sm">{errors.email}</span>
                        )}
                    </div>

                    <div className="form-group mb-6">
                        <Label htmlFor="phoneNumber">Your Phone Number</Label>
                        <div className="mt-5 relative mb-1 h-11 w-full min-w-[200px]">
                            <Input
                                type="text"
                                name="phoneNumber"
                                value={values.phoneNumber}
                                onChange={handleChange}
                                id="phoneNumber"
                                className={errors.phoneNumber && touched.phoneNumber ? "border-red-500" : ""}
                                placeholder="Enter your phone number"
                            />
                            {errors.phoneNumber && touched.phoneNumber && (
                                <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group mb-6">
                        <Label htmlFor="password">Your Password</Label>
                        <div className="mt-5 relative mb-1 h-11 w-full min-w-[200px]">
                            <Input
                                type={show ? "text" : "password"}
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                id="password"
                                className={errors.password && touched.password ? "border-red-500" : ""}
                                placeholder="Enter your password"
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
                                <span className="text-red-500 text-sm">{errors.password}</span>
                            )}
                        </div>
                    </div>

                    <Button type="submit" className="flex w-full justify-center gap-2 px-2 py-2 shadow-md" value="Sign Up">
                        <h5 className="text-sm font-semibold uppercase">
                            Sign up
                        </h5>
                    </Button>

                    <div className="mt-4 mb-4 text-center">
                        <p className="text-sm">OR</p>
                        <Button variant="outline" className="w-full flex justify-center gap-2 mt-2" onClick={() => signIn("facebook")}>
                            <FaFacebookF className="w-5 h-5" />
                            <h5 className="text-sm font-semibold uppercase">
                                Sign in with Facebook
                            </h5>
                        </Button>
                        <Button variant="outline" className="w-full flex justify-center gap-2 mt-2" onClick={() => signIn("google")}>
                            <FaGoogle className="w-5 h-5" />
                            <h5 className="text-sm font-semibold uppercase">
                                Sign in with Google
                            </h5>
                        </Button>
                    </div>

                    <p className="flex justify-center mt-4 text-sm">
                        Already have an account?{" "}
                        <span className="ml-1 font-bold text-blue-500 cursor-pointer" onClick={() => setRoute("Login")}>
                            Sign in
                        </span>
                    </p>
                </form>
            </div>
        </>
    )
}

export default SignUp;
