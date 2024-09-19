import { StarIcon } from 'lucide-react';
import React from 'react'
import { Card } from '../ui/card';
import ReviewCard from './ReviewCard';

export const reviews = [
    {
        name: "Gene Bates",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        profession: "Student | Cambridge University",
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
    {
        name: "Verna Santos",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        profession: "Full stack developer | Quarter Ltd.",
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
    {
        name: "Clara Bowers",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        profession: "Software Engineer | TechCorp",
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
    {
        name: "Andrew Mackenzie",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        profession: "Doctor | City Hospital",
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
    {
        name: "Eliza Carter",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        profession: "Teacher | HighSchool",
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
    {
        name: "Lucas Hernandez",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        profession: "Architect | DesignHub",
        comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    },
    // {
    //     name: "Anna Thompson",
    //     avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    //     profession: "Data Analyst | Market Insights",
    //     comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    // },
    // {
    //     name: "Michael Johnson",
    //     avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    //     profession: "Freelancer | Software Developer",
    //     comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    // },
    // {
    //     name: "Sophia Lee",
    //     avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    //     profession: "Graphic Designer | Creative Studio",
    //     comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    // },
    // {
    //     name: "John Davies",
    //     avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    //     profession: "Marketing Manager | SalesCo",
    //     comment: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisquam, quidem.",
    // }
];


const Reviews = () => {
    return (
        <>
            <section className="bg-background py-12 md:py-16">
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
                            {/* <div className="flex items-center justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div> */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Reviews;
