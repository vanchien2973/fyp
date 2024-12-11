import { useEditLayoutMutation, useGetHeroDataQuery } from '@/app/redux/features/layout/layoutApi';
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Minus, Plus, Trash } from 'lucide-react';
import Loader from '../../Loader/Loader';
import toast from 'react-hot-toast';

const EditFaq = () => {
    const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", {
        refetchOnMountOrArgChange: true,
    });
    const [questions, setQuestions] = useState([]);
    const [editLayout, { isSuccess: layoutSuccess, error }] = useEditLayoutMutation();

    useEffect(() => {
        if (data && data.layout && data.layout.faq) {
            setQuestions(data.layout.faq);
        }
        if (layoutSuccess) {
            toast.success('FAQ updated successfully');
            refetch();
        }
        if (error && error.data) {
            toast.error(error.data.message);
        }
    }, [data, layoutSuccess, error]);

    const toggleQuestion = (id) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question._id === id ? { ...question, active: !question.active } : question
            )
        );
    };

    const handleQuestionChange = (id, value) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question._id === id ? { ...question, question: value } : question
            )
        );
    };

    const handleAnswerChange = (id, value) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question._id === id ? { ...question, answer: value } : question
            )
        );
    };

    const newFaqHandle = () => {
        setQuestions([
            ...questions,
            {
                _id: Date.now().toString(),
                question: '',
                answer: '',
                active: false,
            },
        ]);
    };

    const areQuestionsUnchanged = (originalQuestions, newQuestions) => {
        return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
    };

    const isAnyQuestionEmpty = (questions) => {
        return questions.some((q) => q.question === '' || q.answer === '');
    };

    const handleEdit = async () => {
        const originalQuestions = data?.layout?.faq;
        if (!areQuestionsUnchanged(originalQuestions, questions) && !isAnyQuestionEmpty(questions)) {
            const questionsToSubmit = questions.map(({ _id, ...rest }) => rest);
            await editLayout({
                type: 'FAQ',
                faq: questionsToSubmit
            }).unwrap();
        }
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">Frequently Asked Questions</h2>
                    {questions.map((q, index) => (
                        <Accordion type="single" key={q._id} collapsible className="mb-4">
                            <AccordionItem value={`q-${index}`} className="border rounded-md shadow-sm">
                                <AccordionTrigger className="flex items-center justify-between p-4"  onClick={() => toggleQuestion(q._id)}>
                                    <Input
                                        value={q.question}
                                        onChange={(e) => handleQuestionChange(q._id, e.target.value)}
                                        placeholder="Enter your question"
                                        className="flex-2 w-[95%]"
                                    />
                                </AccordionTrigger>
                                <AccordionContent className="p-4 bg-gray-50 dark:bg-gray-800">
                                    {q.active && (
                                        <>
                                            <Textarea
                                                value={q.answer}
                                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                                placeholder="Enter your answer"
                                                className="mb-4"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    setQuestions((prevQuestions) =>
                                                        prevQuestions.filter((item) => item._id !== q._id)
                                                    )
                                                }
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                    <Button
                        onClick={newFaqHandle}
                        className="w-full mt-4"
                    >
                        Add New FAQ
                    </Button>
                    <div className="mt-8 flex justify-end">
                        <Button
                            type="button"
                            onClick={
                                areQuestionsUnchanged(data?.layout?.faq, questions) || isAnyQuestionEmpty(questions)
                                    ? () => null
                                    : handleEdit
                            }
                            className={`rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 ${areQuestionsUnchanged(data?.layout?.faq, questions) || isAnyQuestionEmpty(questions)
                                    ? 'cursor-not-allowed'
                                    : 'cursor-pointer'
                                }`}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditFaq;
