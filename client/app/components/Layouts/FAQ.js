import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useGetHeroDataQuery } from '@/app/redux/features/layout/layoutApi';

const FAQ = () => {
    const { data, isLoading } = useGetHeroDataQuery("FAQ", {});
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (data) {
            setQuestions(data.layout.faq);
        }
    }, [data]);
    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <section className="py-12 md:py-20">
                            <div className="container">
                                <div className="mx-auto max-w-3xl space-y-6 text-center">
                                    <h2 className="text-2xl font-bold md:text-3xl tracking-tight">Frequently Asked Questions</h2>
                                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                                        Get answers to the most common questions about our courses.
                                    </p>
                                </div>
                                <div className="mx-auto mt-12 max-w-3xl space-y-4">
                                    <Accordion type="single" collapsible>
                                        {questions.map((question, index) => (
                                            <AccordionItem key={index} value={`item-${index}`}>
                                                <AccordionTrigger className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium">{question.question}</h3>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        {question.answer}
                                                    </p>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        </section>
                    </>
                )
            }
        </>
    )
}

export default FAQ
