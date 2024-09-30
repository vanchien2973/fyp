import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import Image from "next/image";
import person from '../../../public/assets/person.png';
import study from '../../../public/assets/study.jpg';
import education from '../../../public/assets/education.jpeg';
import aboutus1 from '../../../public/assets/aboutus1.jpeg';
import { BoltIcon, HeartIcon, LeafIcon, RocketIcon, SmileIcon, UsersIcon } from "lucide-react";
import { Card } from "../ui/card";

export default function About() {
    return (
        <div className="flex flex-col min-h-[100dvh]">
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">About ELP</h1>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            E is the fifth letter of the English alphabet, and LP stands for Learning Path.
                        </p>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            /eːl piː/ Master means the learning path that each of us needs to explore and pursue to develop ourselves, which is Learning Path Mastery.
                        </p>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            ELP, with its mission to explore and optimize each individual's learning path, equips everyone with the most effective learning methods to adapt and progress in an ever-changing world.
                        </p>
                    </div>
                    <Image
                        src={aboutus1}
                        width="550"
                        height="310"
                        alt="About Us"
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                    />
                </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Personalized Education at ELP</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div>
                            <Image
                                src={study}
                                alt="Personalized Education"
                                width={600}
                                height={400}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                        <div className="space-y-4">
                            <Card className="p-6">
                                <h3 className="text-xl font-semibold mb-2">ELP deeply understands the learning objectives and differences of each student</h3>
                                <p className="text-muted-foreground">ELP understands the learning goals and individual differences of each student, thereby providing the most suitable learning options, ensuring that each student has an effective and unique learning path.</p>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-xl font-semibold mb-2">ELP is committed to the quality of learning</h3>
                                <p className="text-muted-foreground">ELP is committed to 100% of students achieving the desired results. Students at ELP can be completely assured with the Zero-risk policy: 100% of the cost of re-exams and re-study for students who do not achieve the promised results.</p>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-xl font-semibold mb-2">ELP develops more effective and understandable methods of learning foreign languages</h3>
                                <p className="text-muted-foreground">ELP is constantly researching and developing optimal teaching methods and techniques to help students experience a great learning environment and achieve their learning goals in the most effective way.</p>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-xl font-semibold mb-2">ELP shares positive values to English learners</h3>
                                <p className="text-muted-foreground">ELP publishes a high-quality and rich English learning resource system on topics, applies research results, and develops advanced learning methods, making it easy and convenient for students to learn anywhere and anytime.</p>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Meet Our Team</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Our team of experts is dedicated to delivering exceptional results for our clients.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <Card className="p-6 flex flex-col items-center text-center">
                            <Avatar className="mb-4">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold">John Doe</h3>
                            <p className="text-muted-foreground">CEO</p>
                            <p className="text-sm text-muted-foreground">
                                John is the co-founder and CEO of Acme Inc. He has over 15 years of experience in the tech industry and
                                is passionate about building innovative products.
                            </p>
                        </Card>
                        <Card className="p-6 flex flex-col items-center text-center">
                            <Avatar className="mb-4">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold">Jane Doe</h3>
                            <p className="text-muted-foreground">CTO</p>
                            <p className="text-sm text-muted-foreground">
                                Jane is the co-founder and CTO of Acme Inc. She has a background in computer science and has been
                                leading the technical team for the past 10 years.
                            </p>
                        </Card>
                        <Card className="p-6 flex flex-col items-center text-center">
                            <Avatar className="mb-4">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>BS</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold">Bob Smith</h3>
                            <p className="text-muted-foreground">Head of Design</p>
                            <p className="text-sm text-muted-foreground">
                                Bob is the Head of Design at Acme Inc. He has a keen eye for design and has been instrumental in
                                creating the beautiful user experiences for our products.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Core Values</h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            At Acme Inc., we are guided by a set of core values that underpin everything we do.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <Card className="p-6 flex flex-col items-center text-center">
                            <RocketIcon className="w-8 h-8 mb-4 text-primary" />
                            <h3 className="text-xl font-bold">Innovation</h3>
                            <p className="text-sm text-muted-foreground">
                                We are constantly exploring new technologies and ideas to create innovative solutions for our clients.
                            </p>
                        </Card>
                        <Card className="p-6 flex flex-col items-center text-center">
                            <UsersIcon className="w-8 h-8 mb-4 text-primary" />
                            <h3 className="text-xl font-bold">Collaboration</h3>
                            <p className="text-sm text-muted-foreground">
                                We believe in the power of teamwork and work closely with our clients to achieve their goals.
                            </p>
                        </Card>
                        <Card className="p-6 flex flex-col items-center text-center">
                            <BoltIcon className="w-8 h-8 mb-4 text-primary" />
                            <h3 className="text-xl font-bold">Excellence</h3>
                            <p className="text-sm text-muted-foreground">
                                We are committed to delivering exceptional results and exceeding our clients' expectations.
                            </p>
                        </Card>
                        <Card className="p-6 flex flex-col items-center text-center">
                            <LeafIcon className="w-8 h-8 mb-4 text-primary" />
                            <h3 className="text-xl font-bold">Sustainability</h3>
                            <p className="text-sm text-muted-foreground">
                                We are dedicated to building sustainable solutions that minimize our environmental impact.
                            </p>
                        </Card>
                        <Card className="p-6 flex flex-col items-center text-center">
                            <HeartIcon className="w-8 h-8 mb-4 text-primary" />
                            <h3 className="text-xl font-bold">Integrity</h3>
                            <p className="text-sm text-muted-foreground">
                                We are committed to the highest ethical standards and always act with honesty and transparency.
                            </p>
                        </Card>
                        <Card className="p-6 flex flex-col items-center text-center">
                            <SmileIcon className="w-8 h-8 mb-4 text-primary" />
                            <h3 className="text-xl font-bold">Passion</h3>
                            <p className="text-sm text-muted-foreground">
                                We are passionate about our work and strive to create solutions that make a positive impact on the
                                world.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}