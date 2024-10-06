import { StarIcon } from 'lucide-react';
import React from 'react'
import { Card } from '../ui/card';
import ReviewCard from './ReviewCard';

export const reviews = [
    {
        name: "Gene Bates",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        profession: "Student | Cambridge University",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
    {
        name: "Verna Santos",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        profession: "Full stack developer | Quarter Ltd.",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
    {
        name: "Clara Bowers",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        profession: "Software Engineer | TechCorp",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
    {
        name: "Andrew Mackenzie",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        profession: "Doctor | City Hospital",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
    {
        name: "Eliza Carter",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        profession: "Teacher | HighSchool",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
    {
        name: "Lucas Hernandez",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        profession: "Architect | DesignHub",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
];


const Reviews = () => {
    return (
        <>
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-8">
                        <div className="grid gap-2 text-center">
                            <h2 className="text-2xl font-bold md:text-3xl tracking-tight">Course Reviews</h2>
                            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">See what our customers have to say about this course.</p>
                        </div>
                        <div className="grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {
                                   reviews && reviews.map((i, index) => 
                                        <ReviewCard item={i} key={index} />
                                   )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Reviews;
