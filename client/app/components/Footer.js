import Link from "next/link";
import { FaFacebookF, FaYoutube, FaTiktok, FaInstagram, FaHome, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
    return (
        <footer>
            <div className="border border-[#0000000e] py-4">
                <div className="w-[95%] max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center text-base text-black">
                        <span>Get connected with us on social networks:</span>
                        <div className="flex justify-center ml-4 space-x-6">
                            <Link href="#" className="text-black">
                                <FaFacebookF className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="text-black">
                                <FaYoutube className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="text-black">
                                <FaTiktok className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="text-black">
                                <FaInstagram className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-[#0000000e] dark:border-[#ffffff1e] py-8">
                <div className="flex justify-center items-center w-[95%] max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                        <div className="space-y-3">
                            <h3 className="text-[20px] font-[600] text-black">
                                About
                            </h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        href="/aboutus"
                                        className="text-base py-1 font-normal !text-gray-700 transition-colors hover:!text-gray-900"
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/policy"
                                        className="text-base py-1 font-normal !text-gray-700 transition-colors hover:!text-gray-900"
                                    >
                                        Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-[20px] font-[600] text-black">
                                Quick Links
                            </h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        href="/courses"
                                        className="text-base py-1 font-normal !text-gray-700 transition-colors hover:!text-gray-900"
                                    >
                                        Courses
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/blog"
                                        className="text-base py-1 font-normal !text-gray-700 transition-colors hover:!text-gray-900"
                                    >
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/forum"
                                        className="text-base text-black"
                                    >
                                        Forum
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-[20px] font-[600] text-black">
                                Contact Us
                            </h3>
                            <p className="mb-4 flex text-base py-1 font-normal !text-gray-700 transition-colors hover:!text-gray-900">
                                <span className="me-3 [&>svg]:h-5 [&>svg]:w-5">
                                    <FaHome />
                                </span>
                                2 Pham Van Bach, Yen Hoa, Cau Giay, Ha Noi, Viet Nam
                            </p>
                            <p className="mb-4 flex items-center text-base py-1 font-normal !text-gray-700 transition-colors hover:!text-gray-900">
                                <span className="me-3 [&>svg]:h-5 [&>svg]:w-5">
                                    <FaEnvelope />
                                </span>
                                lms@example.com
                            </p>
                            <p className="mb-4 flex items-center text-base py-1 font-normal !text-gray-700 transition-colors hover:!text-gray-900">
                                <span className="me-3 [&>svg]:h-5 [&>svg]:w-5">
                                    <FaPhoneAlt />
                                </span>
                                + 84 1900 9988
                            </p>
                        </div>
                    </div>
                </div>
                <br /><br />
                <p className="text-center text-black">
                    Copyright © 2024 ELP | All Right Reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;
