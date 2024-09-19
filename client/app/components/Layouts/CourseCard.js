import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Logs, User2 } from "lucide-react";
import Rating from "@/app/utils/Rating";

const CourseCard = ({ course, isProfile }) => {
  return (
    <Link
      href={!isProfile ? `/courses/course/${course._id}` : `/courses/course-access/${course._id}`}
    >
      <Card className="w-[300px] shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
        <CardHeader className="relative h-40 bg-gradient-to-r p-0 overflow-hidden">
          <Image
            src={course.thumbnail?.url}
            alt={course.name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">{course.name}</h2>
          </div>
          <div className="flex items-center justify-between space-x-1">
            <Rating rating={course.ratings} />
            <span className={`text-sm ${isProfile ? "hidden sm:inline-flex" : ""}`}>
              {course.purchased} Students
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold">{course.price === 0 ? 'Free' : course.price + '$'}</span>
            <span className="text-sm text-gray-500 line-through ml-2">{course.estimatedPrice}$</span>
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Logs className="h-5 w-5"/>
            <span className="text-sm">
              {course.courseData.length} Lectures
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;