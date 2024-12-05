'use client'
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { benfits_prerequisitesSchema } from '@/lib/form-schema';
import { Form, FormField, FormItem, FormMessage } from '../../ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertTriangleIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import toast from 'react-hot-toast';

const CourseData = ({ benefits, setBenefits, prerequisites, setPrerequisites, currentStep, setCurrentStep }) => {
    const form = useForm({
      resolver: zodResolver(benfits_prerequisitesSchema),
      defaultValues: {
        benefits: benefits.length > 0 ? benefits : [{ title: '' }],
        prerequisites: prerequisites.length > 0 ? prerequisites : [{ title: '' }],
      },
      mode: 'onTouched'
    });
  
    const { control, formState: { errors, isValid }, handleSubmit, trigger } = form;
  
    const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
      control,
      name: "benefits"
    });
  
    const { fields: prerequisiteFields, append: appendPrerequisite, remove: removePrerequisite } = useFieldArray({
      control,
      name: "prerequisites"
    });
  
    const onSubmit = (data) => {
      setBenefits(data.benefits);
      setPrerequisites(data.prerequisites);
      setCurrentStep(currentStep + 1);
    };
  
    const prevButton = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };
  
    return (
      <>
        <Form {...form}>
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Benefits</h3>
              {benefitFields.map((field, index) => (
                <Accordion type="single" collapsible key={field.id}>
                  <AccordionItem value={`benefit-${index}`}>
                    <AccordionTrigger className={cn(
                      'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
                      errors?.benefits?.[index] && 'text-red-700'
                    )}>
                      {`Benefit ${index + 1}`}
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="absolute right-8"
                          onClick={() => removeBenefit(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {errors?.benefits?.[index] && (
                        <span className="alert absolute right-8">
                          <AlertTriangle className="h-4 w-4 text-red-700" />
                        </span>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-1'>
                        <FormField
                          control={control}
                          name={`benefits.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
              <Button variant="outline" type="button" onClick={() => appendBenefit({ title: '' })} className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Benefit
              </Button>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Prerequisites</h3>
              {prerequisiteFields.map((field, index) => (
                <Accordion type="single" collapsible key={field.id}>
                  <AccordionItem value={`prerequisite-${index}`}>
                    <AccordionTrigger className={cn(
                      'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
                      errors?.prerequisites?.[index] && 'text-red-700'
                    )}>
                      {`Prerequisite ${index + 1}`}
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="absolute right-8"
                          onClick={() => removePrerequisite(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {errors?.prerequisites?.[index] && (
                        <span className="alert absolute right-8">
                          <AlertTriangle className="h-4 w-4 text-red-700" />
                        </span>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-1'>
                        <FormField
                          control={control}
                          name={`prerequisites.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
              <Button variant="outline" type="button" onClick={() => appendPrerequisite({ title: '' })} className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Prerequisite
              </Button>
            </div>
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
                  type="submit"
                  disabled={!isValid || currentStep === 2}
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
          </form>
        </Form>
      </>
    );
  };
  
  export default CourseData;