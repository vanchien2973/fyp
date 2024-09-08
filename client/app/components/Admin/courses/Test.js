"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseContentSchema } from "@/lib/form-schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { cn } from "@/lib/utils";
import { AlertTriangleIcon, PlusCircle, Trash2, Trash2Icon } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";

const CourseContent = ({ currentStep, setCurrentStep, courseContentData, setCourseContentData, handleSubmit: handleCourseSubmit }) => {
    const [isCollapsed, setIsCollapsed] = useState(
        Array(courseContentData.length).fill(false)
    );

    const handleCollapseToggle = (index) => {
        const newIsCollapsed = [...isCollapsed];
        newIsCollapsed[index] = !newIsCollapsed[index];
        setIsCollapsed(newIsCollapsed);
    };

    const [activeSection, setActiveSection] = useState(1);

    const form = useForm({
        resolver: zodResolver(courseContentSchema),
        defaultValues: courseContentData,
        mode: 'onChange'
    });

    const { control, formState: { errors } } = form;

    const handleNewContent = () => {
        const lastContent = courseContentData[courseContentData.length - 1];
        if (lastContent.title === '' || lastContent.description === '' || lastContent.videoUrl === '' || lastContent.links[0].title === '' || lastContent.links[0].url === '') {
            toast.error('Please fill all the fields');
        } else {
            const newContent = {
                videoUrl: '',
                title: '',
                description: '',
                links: [{ title: '', url: '' }],
            };
            setCourseContentData([...courseContentData, newContent]);
        }
    };

    const handleAddNewSection = () => {
        if (
            courseContentData[courseContentData.length - 1].title === '' ||
            courseContentData[courseContentData.length - 1].description === '' ||
            courseContentData[courseContentData.length - 1].videoUrl === '' ||
            courseContentData[courseContentData.length - 1].links[0].title === '' ||
            courseContentData[courseContentData.length - 1].links[0].url === ''
        ) {
            toast.error('Please fill all the fields');
        } else {
            setActiveSection(activeSection + 1);
            const newCourseContentData = {
                videoUrl: '',
                title: '',
                description: '',
                videoSection: `Untitled Section ${activeSection}`,
                links: [{ title: '', url: '' }],
            };
            setCourseContentData([...courseContentData, newCourseContentData]);
        }
    };

    const prevButton = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleAddLink = (index) => {
        const newCourseContentData = [...courseContentData];
        newCourseContentData[index].links.push({ title: '', url: '' });
        setCourseContentData(newCourseContentData);
    };

    const handleRemoveLink = (index, linkIndex) => {
        const newCourseContentData = [...courseContentData];
        newCourseContentData[index].links.splice(linkIndex, 1);
        setCourseContentData(newCourseContentData);
    };

    const next = async () => {
        if (
            courseContentData[courseContentData.length - 1].title === '' ||
            courseContentData[courseContentData.length - 1].description === '' ||
            courseContentData[courseContentData.length - 1].videoUrl === '' ||
            courseContentData[courseContentData.length - 1].links[0].title === '' ||
            courseContentData[courseContentData.length - 1].links[0].url === ''
        ) {
            toast.error(`Section can't be empty`);
        } else {
            setCurrentStep(currentStep + 1);
            handleCourseSubmit();
        }
    };

    return (
        <>
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(next)}>
                    <div
                        className={cn(
                            currentStep === 2
                                ? 'w-full md:inline-block'
                                : 'gap-8 md:grid md:grid-cols-3'
                        )}
                    >
                        <div className="border border-gray-300 rounded-md p-4 mb-4 space-y-4">
                            {courseContentData.map((item, index) => {
                                const showSectionInput =
                                    index === 0 ||
                                    item.videoSection !== courseContentData[index - 1].videoSection;
                                return (
                                    <>
                                        <div key={index} className="border border-gray-300 rounded-md p-4 mb-8 space-y-4">
                                            <Accordion type="single" collapsible >
                                                <AccordionItem
                                                    className={cn(
                                                        `relative mb-4 gap-8 w-[50%] border p-3 md:grid md:grid-cols-1 ${showSectionInput ? "mt-5 mb-4" : "mb-3"}`,
                                                        errors?.courseContentData?.[index] && 'text-red-700'
                                                    )}
                                                >
                                                    {showSectionInput && (
                                                        <FormField
                                                            control={form.control}
                                                            name={`courseContentData.${index}.videoSection`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            value={item.videoSection}
                                                                            onChange={(e) => {
                                                                                const newCourseContentData = [...courseContentData];
                                                                                newCourseContentData[index].videoSection = e.target.value;
                                                                                setCourseContentData(newCourseContentData);
                                                                                field.onChange(e);
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    )}
                                                </AccordionItem>
                                            </Accordion>

                                            <Accordion type="single" collapsible >
                                                <AccordionItem value={`item-${index}`}>
                                                    <AccordionTrigger
                                                        className={cn(
                                                            'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
                                                            errors?.courseContentData?.[index] && 'text-red-700'
                                                        )}
                                                    >
                                                        {isCollapsed[index] ? (
                                                            <>
                                                                {item.title ? (
                                                                    <>
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`courseContentData.${index}.videoSection`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormControl>
                                                                                        <FormLabel>
                                                                                            {index + 1}. {item.title}
                                                                                        </FormLabel>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div></div>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="absolute right-8"
                                                            onClick={() => {
                                                                if (index > 0) {
                                                                    const updateData = [...courseContentData];
                                                                    updateData.splice(index, 1);
                                                                    setCourseContentData(updateData);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2Icon className="h-4 w-4 " />
                                                        </Button>
                                                        {errors?.courseContentData?.[index] && (
                                                            <span className="alert absolute right-8">
                                                                <AlertTriangleIcon className="h-4 w-4   text-red-700" />
                                                            </span>
                                                        )}
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        {!isCollapsed[index] && (<>
                                                            <div className='relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-2'>
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`courseContentData.${index}.title`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Title</FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    value={item.title}
                                                                                    onChange={(e) => {
                                                                                        const updateData = [...courseContentData];
                                                                                        updateData[index].title = e.target.value;
                                                                                        setCourseContentData(updateData);
                                                                                        field.onChange(e);
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`courseContentData.${index}.videoUrl`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Video Url</FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    value={item.videoUrl}
                                                                                    onChange={(e) => {
                                                                                        const updateData = [...courseContentData];
                                                                                        updateData[index].videoUrl = e.target.value;
                                                                                        setCourseContentData(updateData);
                                                                                        field.onChange(e);
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-1'>
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`courseContentData.${index}.description`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Description</FormLabel>
                                                                            <FormControl>
                                                                                <Textarea
                                                                                    {...field}
                                                                                    value={item.description}
                                                                                    onChange={(e) => {
                                                                                        const updateData = [...courseContentData];
                                                                                        updateData[index].description = e.target.value;
                                                                                        setCourseContentData(updateData);
                                                                                        field.onChange(e);
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                            {item?.links?.length > 0 && item?.links.map((link, linkIndex) => (
                                                                <Accordion type="single" collapsible key={linkIndex}>
                                                                    <AccordionItem value={`courseContentData.${index}.links.${linkIndex}`}>
                                                                        <AccordionTrigger className={cn(
                                                                            'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
                                                                            errors?.courseContentData?.[index]?.links?.[linkIndex] && 'text-red-700'
                                                                        )}>
                                                                            {`Link ${linkIndex + 1}`}
                                                                            <Button
                                                                                variant="outline"
                                                                                size="icon"
                                                                                className="absolute right-8"
                                                                                onClick={() =>
                                                                                    linkIndex > 0 &&
                                                                                    handleRemoveLink(index, linkIndex)
                                                                                }
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                            {errors?.courseContentData?.[index]?.links?.[linkIndex] && (
                                                                                <span className="alert absolute right-8">
                                                                                    <AlertTriangleIcon className="h-4 w-4 text-red-700" />
                                                                                </span>
                                                                            )}
                                                                        </AccordionTrigger>
                                                                        <AccordionContent>
                                                                            <div key={linkIndex} className="relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-2">
                                                                                <FormField
                                                                                    control={form.control}
                                                                                    name={`courseContentData.${index}.links.${linkIndex}.title`}
                                                                                    render={({ field }) => (
                                                                                        <FormItem>
                                                                                            <FormLabel>Link Title</FormLabel>
                                                                                            <FormControl>
                                                                                                <Input
                                                                                                    {...field}
                                                                                                    value={link.title}
                                                                                                    onChange={(e) => {
                                                                                                        const updateData = [...courseContentData];
                                                                                                        updateData[index].links[linkIndex].title = e.target.value;
                                                                                                        setCourseContentData(updateData);
                                                                                                        field.onChange(e);
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                            <FormMessage />
                                                                                        </FormItem>
                                                                                    )}
                                                                                />
                                                                                <FormField
                                                                                    control={form.control}
                                                                                    name={`courseContentData.${index}.links.${linkIndex}.url`}
                                                                                    render={({ field }) => (
                                                                                        <FormItem>
                                                                                            <FormLabel>Link URL</FormLabel>
                                                                                            <FormControl>
                                                                                                <Input
                                                                                                    {...field}
                                                                                                    value={link.url}
                                                                                                    onChange={(e) => {
                                                                                                        const updateData = [...courseContentData];
                                                                                                        updateData[index].links[linkIndex].url = e.target.value;
                                                                                                        setCourseContentData(updateData);
                                                                                                        field.onChange(e);
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                            <FormMessage />
                                                                                        </FormItem>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                </Accordion>
                                                            ))}
                                                            <Button variant="outline" onClick={() => handleAddLink(index)} className="mt-4">
                                                                <PlusCircle className="h-4 w-4 mr-2" /> Add Link
                                                            </Button>
                                                        </>
                                                        )}
                                                        {index === courseContentData.length - 1 && (
                                                            <Button variant="outline" onClick={() => handleNewContent()} className="mt-4">
                                                                <PlusCircle className="h-4 w-4 mr-2" /> Add New Content
                                                            </Button>
                                                        )}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <Button
                            type="button"
                            className="flex justify-center"
                            size={'lg'}
                            onClick={handleAddNewSection}
                        >
                            Add New Section
                        </Button>
                    </div>
                </form>
            </Form>
            {/* Navigation */}
            <div className="mt-8 pt-5">
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => prevButton()}
                        disabled={currentStep === 0}
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        disabled={currentStep === 3}
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default CourseContent;