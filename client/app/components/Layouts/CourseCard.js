import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Bookmark, GraduationCap, Logs, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import Rating from "@/app/utils/Rating";

const CourseCard = ({ course, isProfile }) => {
  return (
    <Link
      href={!isProfile ? `/courses/course/${course._id}` : `/courses/course-access/${course._id}`}
    >
      <Card className="w-full max-w-[350px] overflow-hiddentransition-all duration-300 ease-in-out hover:shadow-lg hover:scale-102">
        <CardHeader className="relative h-48 p-0">
          <Image
            src={course.thumbnail?.url}
            alt={course.name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
          {course.price === 0 && (
            <Badge className="absolute top-2 right-2">Free</Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
              {course.name}
            </h2>
            <div className="flex items-center justify-between">
              <Rating rating={course.ratings} />
              <span className={`text-sm text-gray-500 ${isProfile ? "hidden sm:inline-flex" : ""}`}>
                {course.purchased} Students
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4rounded-b-lg">
          <div>
            <span className="text-xl font-bold">
              {course.price === 0 ? "Free" : `${course.price}$`}
            </span>
            {course.estimatedPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {course.estimatedPrice}$
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Logs className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {course.courseData.length} Lectures
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;