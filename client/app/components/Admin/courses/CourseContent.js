"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseContentSchema } from "@/lib/form-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { AlertTriangleIcon, PlusCircle, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const CourseContent = ({ currentStep, setCurrentStep, courseContentData, setCourseContentData, handleSubmit: handleCourseSubmit }) => {
    const [activeSection, setActiveSection] = useState(1);

    const form = useForm({
        resolver: zodResolver(courseContentSchema),
        defaultValues: { courseContentData },
        mode: 'onChange'
    });

    const { control, formState: { errors } } = form;

    const handleNewContent = (sectionIndex) => {
        const lastSection = courseContentData[courseContentData.length - 1];
        if (!lastSection || !lastSection.content || lastSection.content.length === 0) {
            toast.error('Please add content to the current section first');
            return;
        }

        const lastContent = lastSection.content[lastSection.content.length - 1];
        if (!lastContent) {
            toast.error('Unable to add new content. Please try again.');
            return;
        }

        if (
            !lastContent.title ||
            !lastContent.description ||
            !lastContent.videoUrl ||
            !lastContent.videoLength ||
            !lastContent.links ||
            lastContent.links.length === 0 ||
            !lastContent.links[0].title ||
            !lastContent.links[0].url
        ) {
            toast.error('Please fill all the fields in the current content');
            return;
        }

        const newContent = {
            videoUrl: '',
            videoLength: '',
            title: '',
            description: '',
            links: [{ title: '', url: '' }],
        };

        const newCourseContentData = courseContentData.map((section, idx) => {
            if (idx === sectionIndex) {
                return {
                    ...section,
                    content: [...section.content, newContent]
                };
            }
            return section;
        });

        setCourseContentData(newCourseContentData);
    };

    const handleAddNewSection = () => {
        const lastSection = courseContentData[courseContentData.length - 1];
        const lastContent = lastSection.content[lastSection.content.length - 1];

        if (!lastContent ||
            !lastContent.title ||
            !lastContent.description ||
            !lastContent.videoUrl ||
            !lastContent.videoLength ||
            !lastContent.links ||
            lastContent.links.length === 0 ||
            !lastContent.links[0].title ||
            !lastContent.links[0].url
        ) {
            toast.error('Please fill all the fields in the current section');
        } else {
            addNewSection();
        }
    };

    const addNewSection = () => {
        setActiveSection(prevActiveSection => prevActiveSection + 1);
        const newSection = {
            videoSection: `Untitled Section ${activeSection}`,
            content: [{
                videoUrl: '',
                videoLength: '',
                title: '',
                description: '',
                links: [{ title: '', url: '' }],
            }]
        };
        setCourseContentData(prevData => [...prevData, newSection]);
    };

    const handleAddLink = (sectionIndex, contentIndex) => {
        const newCourseContentData = courseContentData.map((section, sIdx) => {
            if (sIdx === sectionIndex) {
                return {
                    ...section,
                    content: section.content.map((content, cIdx) => {
                        if (cIdx === contentIndex) {
                            return {
                                ...content,
                                links: [...content.links, { title: '', url: '' }] 
                            };
                        }
                        return content;
                    })
                };
            }
            return section;
        });

        setCourseContentData(newCourseContentData);
    };
    
    const handleRemoveLink = (sectionIndex, contentIndex, linkIndex) => {
        const newCourseContentData = courseContentData.map((section, sIdx) => {
            if (sIdx === sectionIndex) {
                return {
                    ...section,
                    content: section.content.map((content, cIdx) => {
                        if (cIdx === contentIndex) {
                            return {
                                ...content,
                                links: content.links.filter((_, lIdx) => lIdx !== linkIndex)
                            };
                        }
                        return content;
                    })
                };
            }
            return section;
        });
        setCourseContentData(newCourseContentData);
    };
    

    const handleRemoveSection = (index) => {
        const updateData = [...courseContentData];
        updateData.splice(index, 1);
        setCourseContentData(updateData);
    }

    const handleRemoveContent = (sectionIndex, contentIndex) => {
        const newCourseContentData = [...courseContentData];
        newCourseContentData[sectionIndex].content.splice(contentIndex, 1);
        setCourseContentData(newCourseContentData);
    };

    const prevButton = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const next = async () => {
        const lastSection = courseContentData[courseContentData.length - 1];
        const lastContent = lastSection.content[lastSection.content.length - 1];

        if (!lastContent ||
            !lastContent.title ||
            !lastContent.description ||
            !lastContent.videoUrl ||
            !lastContent.videoLength ||
            !lastContent.links ||
            lastContent.links.length === 0 ||
            !lastContent.links[0].title ||
            !lastContent.links[0].url
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
                    {courseContentData.map((section, sectionIndex) => (
                        <div className="border border-gray-300 rounded-md p-4 mb-4 space-y-4">
                            <Accordion type="single" collapsible key={sectionIndex}>
                                <AccordionItem value={`section-${sectionIndex}`}>
                                    <AccordionTrigger className={cn(
                                        'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
                                        errors?.courseContentData?.[sectionIndex] && 'text-red-700'
                                    )}>
                                        <FormField
                                            control={form.control}
                                            name={`courseContentData.${sectionIndex}.videoSection`}
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input
                                                            className="w-1/3"
                                                            {...field}
                                                            value={section.videoSection}
                                                            onChange={(e) => {
                                                                const newCourseContentData = courseContentData.map((section, index) => {
                                                                    if (index === sectionIndex) {
                                                                        return { ...section, videoSection: e.target.value };
                                                                    }
                                                                    return section;
                                                                });
                                                                setCourseContentData(newCourseContentData);
                                                                field.onChange(e);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="absolute right-8"
                                            onClick={(e) => {
                                                if (sectionIndex > 0) {
                                                    handleRemoveSection(sectionIndex)
                                                }
                                            }}
                                        >
                                            <Trash2Icon className="h-4 w-4" />
                                        </Button>
                                        {errors?.courseContentData?.[sectionIndex] && (
                                            <span className="alert absolute right-8">
                                                <AlertTriangleIcon className="h-4 w-4 text-red-700" />
                                            </span>
                                        )}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {section.content.map((item, contentIndex) => (
                                            <Accordion type="single" collapsible key={contentIndex}>
                                                <AccordionItem value={`courseContentData.${sectionIndex}.content.${contentIndex}`}>
                                                    <AccordionTrigger
                                                        className={cn(
                                                            'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
                                                            errors?.courseContentData?.[sectionIndex]?.content?.[contentIndex] && 'text-red-700'
                                                        )}
                                                    >
                                                        <FormLabel>
                                                            {`${contentIndex + 1}. ${item.title}`}
                                                        </FormLabel>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            className="absolute right-8"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (contentIndex > 0) {
                                                                    handleRemoveContent(sectionIndex, contentIndex);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2Icon className="h-4 w-4" />
                                                        </Button>
                                                        {errors?.courseContentData?.[sectionIndex]?.content?.[contentIndex] && (
                                                            <span className="alert absolute right-8">
                                                                <AlertTriangleIcon className="h-4 w-4 text-red-700" />
                                                            </span>
                                                        )}
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="border border-gray-300 rounded-md p-4 mb-4 space-y-4">
                                                            <div className='relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-1'>
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`courseContentData.${sectionIndex}.content.${contentIndex}.title`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Title</FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    value={item.title}
                                                                                    onChange={(e) => {
                                                                                        const newCourseContentData = courseContentData.map((section, idx) => {
                                                                                            if (idx === sectionIndex) {
                                                                                                return {
                                                                                                    ...section,
                                                                                                    content: section.content.map((content, contentIdx) => {
                                                                                                        if (contentIdx === contentIndex) {
                                                                                                            return {
                                                                                                                ...content,
                                                                                                                title: e.target.value
                                                                                                            };
                                                                                                        }
                                                                                                        return content;
                                                                                                    })
                                                                                                };
                                                                                            }
                                                                                            return section;
                                                                                        });
                                                                                        setCourseContentData(newCourseContentData);
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
                                                                    name={`courseContentData.${sectionIndex}.content.${contentIndex}.description`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Description</FormLabel>
                                                                            <FormControl>
                                                                                <Textarea
                                                                                    {...field}
                                                                                    value={item.description}
                                                                                    onChange={(e) => {
                                                                                        const newCourseContentData = courseContentData.map((section, idx) => {
                                                                                            if (idx === sectionIndex) {
                                                                                                return {
                                                                                                    ...section,
                                                                                                    content: section.content.map((content, contentIdx) => {
                                                                                                        if (contentIdx === contentIndex) {
                                                                                                            return {
                                                                                                                ...content,
                                                                                                                description: e.target.value
                                                                                                            };
                                                                                                        }
                                                                                                        return content;
                                                                                                    })
                                                                                                };
                                                                                            }
                                                                                            return section;
                                                                                        });
                                                                                        setCourseContentData(newCourseContentData);
                                                                                        field.onChange(e);
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-2'>
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`courseContentData.${sectionIndex}.content.${contentIndex}.videoUrl`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Video URL</FormLabel>
                                                                            <Input
                                                                                {...field}
                                                                                value={item.videoUrl}
                                                                                onChange={(e) => {
                                                                                    const newCourseContentData = courseContentData.map((section, idx) => {
                                                                                        if (idx === sectionIndex) {
                                                                                            return {
                                                                                                ...section,
                                                                                                content: section.content.map((content, contentIdx) => {
                                                                                                    if (contentIdx === contentIndex) {
                                                                                                        return {
                                                                                                            ...content,
                                                                                                            videoUrl: e.target.value
                                                                                                        };
                                                                                                    }
                                                                                                    return content;
                                                                                                })
                                                                                            };
                                                                                        }
                                                                                        return section;
                                                                                    });
                                                                                    setCourseContentData(newCourseContentData);
                                                                                    field.onChange(e);
                                                                                }}
                                                                            />
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`courseContentData.${sectionIndex}.content.${contentIndex}.videoLength`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Video Length (in minutes)</FormLabel>
                                                                            <Input
                                                                                {...field}
                                                                                type="number"
                                                                                value={item.videoLength}
                                                                                onChange={(e) => {
                                                                                    const newCourseContentData = courseContentData.map((section, idx) => {
                                                                                        if (idx === sectionIndex) {
                                                                                            return {
                                                                                                ...section,
                                                                                                content: section.content.map((content, contentIdx) => {
                                                                                                    if (contentIdx === contentIndex) {
                                                                                                        return {
                                                                                                            ...content,
                                                                                                            videoLength: e.target.value
                                                                                                        };
                                                                                                    }
                                                                                                    return content;
                                                                                                })
                                                                                            };
                                                                                        }
                                                                                        return section;
                                                                                    });
                                                                                    setCourseContentData(newCourseContentData);
                                                                                    field.onChange(e);
                                                                                }}
                                                                            />
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                            {item.links.map((link, linkIndex) => (
                                                                <Accordion type="single" collapsible key={linkIndex}>
                                                                    <AccordionItem value={`courseContentData.${sectionIndex}.content.${contentIndex}.links.${linkIndex}`}>
                                                                        <AccordionTrigger className={cn(
                                                                            'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
                                                                            errors?.courseContentData?.[sectionIndex]?.content?.[contentIndex]?.links?.[linkIndex] && 'text-red-700'
                                                                        )}>
                                                                            {`Link ${linkIndex + 1}`}
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                size="icon"
                                                                                className="absolute right-8"
                                                                                onClick={() => linkIndex > 0 && handleRemoveLink(sectionIndex, contentIndex, linkIndex)}
                                                                            >
                                                                                <Trash2Icon className="h-4 w-4" />
                                                                            </Button>
                                                                            {errors?.courseContentData?.[sectionIndex]?.content?.[contentIndex]?.links?.[linkIndex] && (
                                                                                <span className="alert absolute right-8">
                                                                                    <AlertTriangleIcon className="h-4 w-4 text-red-700" />
                                                                                </span>
                                                                            )}
                                                                        </AccordionTrigger>
                                                                        <AccordionContent>
                                                                            <div className='relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-2'>
                                                                                <FormField
                                                                                    control={form.control}
                                                                                    name={`courseContentData.${sectionIndex}.content.${contentIndex}.links.${linkIndex}.title`}
                                                                                    render={({ field }) => (
                                                                                        <FormItem>
                                                                                            <FormLabel>Link Title</FormLabel>
                                                                                            <FormControl>
                                                                                                <Input
                                                                                                    {...field}
                                                                                                    value={link.title}
                                                                                                    onChange={(e) => {
                                                                                                        const newCourseContentData = courseContentData.map((section, sIdx) => {
                                                                                                            if (sIdx === sectionIndex) {
                                                                                                                return {
                                                                                                                    ...section,
                                                                                                                    content: section.content.map((content, cIdx) => {
                                                                                                                        if (cIdx === contentIndex) {
                                                                                                                            return {
                                                                                                                                ...content,
                                                                                                                                links: content.links.map((link, lIdx) => {
                                                                                                                                    if (lIdx === linkIndex) {
                                                                                                                                        return { ...link, title: e.target.value };
                                                                                                                                    }
                                                                                                                                    return link;
                                                                                                                                })
                                                                                                                            };
                                                                                                                        }
                                                                                                                        return content;
                                                                                                                    })
                                                                                                                };
                                                                                                            }
                                                                                                            return section;
                                                                                                        });
                                                                                                        setCourseContentData(newCourseContentData);
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                            <FormMessage />
                                                                                        </FormItem>
                                                                                    )}
                                                                                />
                                                                                <FormField
                                                                                    control={form.control}
                                                                                    name={`courseContentData.${sectionIndex}.content.${contentIndex}.links.${linkIndex}.url`}
                                                                                    render={({ field }) => (
                                                                                        <FormItem>
                                                                                            <FormLabel>Link URL</FormLabel>
                                                                                            <FormControl>
                                                                                                <Input
                                                                                                    {...field}
                                                                                                    value={link.url}
                                                                                                    onChange={(e) => {
                                                                                                        const newCourseContentData = courseContentData.map((section, sIdx) => {
                                                                                                            if (sIdx === sectionIndex) {
                                                                                                                return {
                                                                                                                    ...section,
                                                                                                                    content: section.content.map((content, cIdx) => {
                                                                                                                        if (cIdx === contentIndex) {
                                                                                                                            return {
                                                                                                                                ...content,
                                                                                                                                links: content.links.map((link, lIdx) => {
                                                                                                                                    if (lIdx === linkIndex) {
                                                                                                                                        return { ...link, url: e.target.value };
                                                                                                                                    }
                                                                                                                                    return link;
                                                                                                                                })
                                                                                                                            };
                                                                                                                        }
                                                                                                                        return content;
                                                                                                                    })
                                                                                                                };
                                                                                                            }
                                                                                                            return section;
                                                                                                        });
                                                                                                        setCourseContentData(newCourseContentData);
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
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => handleAddLink(sectionIndex, contentIndex)}
                                                                className="mt-4"
                                                            >
                                                                <PlusCircle className="h-4 w-4 mr-2" /> Add Link
                                                            </Button>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleNewContent(sectionIndex)}
                                            className="mt-4"
                                        >
                                            <PlusCircle className="h-4 w-4 mr-2" /> Add New Content
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    ))}
                </form>
            </Form>
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
            {/* Navigation */}
            <div className="mt-8 pt-5">
                <div className="flex justify-between">
                    <Button
                        type="button"
                        onClick={prevButton}
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
                    </Button>
                    <Button
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
                    </Button>
                </div>
            </div>
        </>
    );
};

export default CourseContent;