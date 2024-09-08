'use client'
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { benfits_prerequisitesSchema } from '@/lib/form-schema';
import { Form, FormField, FormItem, FormMessage } from '../../ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { cn } from '@/lib/utils';
import { AlertTriangleIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import toast from 'react-hot-toast';

const CourseData = ({ benefits, setBenefits, prerequisites, setPrerequisites, currentStep, setCurrentStep }) => {
    const form = useForm({
        resolver: zodResolver(benfits_prerequisitesSchema),
        defaultValues: { benefits, prerequisites },
        mode: 'onChange'
    });

    const { control, formState: { errors } } = form;
    
    const handleBenefitChange = (index, value) => {
        const updatedBenefits = [...benefits];
        updatedBenefits[index] = { title: value };
        setBenefits(updatedBenefits);
    };

    const handleAddBenefit = () => {
        setBenefits([...benefits, { title: '' }]);
    };

    const handlePrerequisiteChange = (index, value) => {
        const updatedPrerequisites = [...prerequisites];
        updatedPrerequisites[index] = { title: value };
        setPrerequisites(updatedPrerequisites);
    };

    const handleAddPrerequisite = () => {
        setPrerequisites([...prerequisites, { title: '' }]);
    };

    const prevButton = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const next = async (e) => {
        e.preventDefault();
        const isValid = await form.trigger();
        if (isValid) {
            setCurrentStep(currentStep + 1);
        } else {
            toast.error("Please fill in all required fields");
        }
    };

    const handleRemoveBenefit = (index) => {
        const updatedBenefits = [...benefits];
        updatedBenefits.splice(index, 1);
        setBenefits(updatedBenefits);
    };
    

    const handleRemovePrerequisite = (index) => {
        const updatedPrerequisites = [...prerequisites];
        updatedPrerequisites.splice(index, 1);
        setPrerequisites(updatedPrerequisites);
    };

    return (
        <>
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(next)}>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Benefits</h3>
                        {benefits.map((benefit, index) => (
                            <Accordion type="single" collapsible key={index}>
                                <AccordionItem value={`benefit-${index}`}>
                                    <AccordionTrigger className={cn(
                                        'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
                                        errors?.benefits?.[index] && 'text-red-700'
                                    )}>
                                        {`Benefit ${index + 1}`}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="absolute right-8"
                                            onClick={() => index > 0 && handleRemoveBenefit(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        {errors?.benefits?.[index] && (
                                            <span className="alert absolute right-8">
                                                <AlertTriangleIcon className="h-4 w-4 text-red-700" />
                                            </span>
                                        )}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className='relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-1'>
                                            <FormField
                                                control={form.control}
                                                name={`benefits.${index}.title`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Input
                                                            {...field}
                                                            value={benefit.title}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                handleBenefitChange(index, e.target.value);
                                                            }}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))}
                        <Button variant="outline" type="button" onClick={handleAddBenefit} className="mt-4">
                            <PlusCircle className="h-4 w-4 mr-2" /> Add Benefit
                        </Button>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Prerequisites</h3>
                        {prerequisites.map((prerequisite, index) => (
                            <Accordion type="single" collapsible key={index}>
                                <AccordionItem value={`prerequisite-${index}`}>
                                    <AccordionTrigger className={cn(
                                        'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
                                        errors?.prerequisites?.[index] && 'text-red-700'
                                    )}>
                                        {`Prerequisite ${index + 1}`}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="absolute right-8"
                                            onClick={() => index > 0 && handleRemovePrerequisite(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        {errors?.prerequisites?.[index] && (
                                            <span className="alert absolute right-8">
                                                <AlertTriangleIcon className="h-4 w-4 text-red-700" />
                                            </span>
                                        )}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className='relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-1'>
                                            <FormField
                                                control={form.control}
                                                name={`prerequisites.${index}.title`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Input
                                                            {...field}
                                                            value={prerequisite.title}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                handlePrerequisiteChange(index, e.target.value);
                                                            }}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))}
                        <Button variant="outline" type="button" onClick={handleAddPrerequisite} className="mt-4">
                            <PlusCircle className="h-4 w-4 mr-2" /> Add Prerequisite
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
                        disabled={currentStep === 2}
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

export default CourseData;