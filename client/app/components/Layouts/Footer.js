import { FacebookIcon, GraduationCap, InstagramIcon, Mail, MapPin, Phone, YoutubeIcon } from "lucide-react";
import Link from "next/link";
import { FaFacebookF, FaYoutube, FaTiktok, FaInstagram, FaHome, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
    return (
        <footer>
            <div className="border border-[#0000000e] py-4">
                <div className="w-[95%] max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center text-base">
                        <span>Get connected with us on social networks:</span>
                        <div className="flex items-center justify-center ml-4 space-x-6">
                            <Link href="#">
                                <FacebookIcon className="h-4 w-4" />
                            </Link>
                            <Link href="#">
                                <YoutubeIcon className="h-5 w-5" />
                            </Link>
                            <Link href="#">
                                <InstagramIcon className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container max-w-7xl mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div className="grid gap-1">
                    <h3 className="font-semibold">Quick Links</h3>
                    <Link href="#" className="hover:underline" prefetch={false}>
                        Home
                    </Link>
                    <Link href="#" className="hover:underline" prefetch={false}>
                        Courses
                    </Link>
                    <Link href="#" className="hover:underline" prefetch={false}>
                        Contact
                    </Link>
                </div>
                <div className="grid gap-1">
                    <h3 className="font-semibold">Resources</h3>
                    <Link href="#" className="hover:underline" prefetch={false}>
                        About Us
                    </Link>
                    <Link href="#" className="hover:underline" prefetch={false}>
                        Forum
                    </Link>
                    <Link href="#" className="hover:underline" prefetch={false}>
                        FAQ
                    </Link>
                </div>
                <div className="grid gap-3">
                    <h3 className="font-semibold text-lg">Contact</h3>
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        <p className="text-sm">
                            <strong>Email:</strong> info@example.com
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <p className="text-sm">
                            <strong>Address:</strong> 123 Đường ABC, Quận XYZ, Thành phố HCM
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        <p className="text-sm">
                            <strong>Phone:</strong> (84) 123-456-789
                        </p>
                    </div>
                </div>
            </div>
            <div className="container max-w-7xl mt-8 mb-6 text-sm text-center text-muted-foreground">
                <p>&copy; 2024 ELP | All right reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
