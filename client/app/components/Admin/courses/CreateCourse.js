"use client";
import React, { useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "@/app/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { HeadingAdmin } from "../../ui/heading";
import { Separator } from "../../ui/separator";

const CreateCourse = () => {
  const [createCourse, { isLoading, isSuccess, error }] = useCreateCourseMutation();
  const title = "Create Course";
  const description = "To create course, we first need some basic information about this course.";
  const [currentStep, setCurrentStep] = useState(0);
  

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully");
      redirect("/admin/courses");
    }
    if (error) {
      if ("data" in error) {
        const errMessage = error;
        toast.error(errMessage?.data.message);
      }
    }
  }, [isLoading, isSuccess, error]);

  const [courseInfor, setCourseInfor] = useState({
    name: "",
    description: "",
    category: { title: "", level: "" },
    rank: "",
    price: "",
    estimatedPrice: "",
    thumbnail: "",
    tags: "",
    demoUrl: "",
  });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoSection: "Untitled Section",
      content: [
        {
          videoUrl: "",
          videoLength: "",
          title: "",
          description: "",
          links: [
            {
              title: "",
              url: "",
            },
          ],
        }
      ]
    }
  ]);
  const [courseData, setCourseData] = useState({});

  const handleSubmit = async () => {
    // Format Benefits Array
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    // Format Prerequisites Array
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));
    // Format Course Content Array
    const formattedCourseContent = courseContentData.map((section) => ({
      videoSection: section.videoSection,
      content: section.content.map((courseContent) => ({
        videoUrl: courseContent.videoUrl,
        videoLength: courseContent.videoLength,
        title: courseContent.title,
        description: courseContent.description,
        links: courseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        suggestion: courseContent.suggestion,
      })),
    }));
    // Prepare Course Data Object
    const data = {
      name: courseInfor.name,
      description: courseInfor.description,
      price: courseInfor.price,
      rank: courseInfor.rank,
      estimatedPrice: courseInfor.estimatedPrice,
      thumbnail: courseInfor.thumbnail,
      tags: courseInfor.tags,
      demoUrl: courseInfor.demoUrl,
      totalVideos: courseContentData.length,
      category: courseInfor.category,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContent,
    };
    setCourseData(data);
  };


  const handleCourse = async (e) => {
    const data = courseData;
    if (!isLoading) {
      await createCourse(data);
    }
  };

  const steps = [
    {
      id: "Step 1",
      name: "Information",
    },
    {
      id: "Step 2",
      name: "Options",
    },
    {
      id: "Step 3",
      name: "Content",
    },
    {
      id: "Step 4",
      name: "Preview",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <HeadingAdmin title={title} description={description} />
      </div>
      <Separator />
      <div>
        <ul className="flex gap-4">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-sky-600 transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-sky-600">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      {currentStep === 0 && (
        <CourseInformation
          courseInfor={courseInfor}
          setCourseInfor={setCourseInfor}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 1 && (
        <CourseData
          benefits={benefits}
          setBenefits={setBenefits}
          prerequisites={prerequisites}
          setPrerequisites={setPrerequisites}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 2 && (
        <CourseContent
          courseContentData={courseContentData}
          setCourseContentData={setCourseContentData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          handleSubmit={handleSubmit}
        />
      )}
      {currentStep === 3 && (
        <CoursePreview
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          courseData={courseData}
          handleCourse={handleCourse}
        />
      )}
    </>
  );
};

export default CreateCourse;
