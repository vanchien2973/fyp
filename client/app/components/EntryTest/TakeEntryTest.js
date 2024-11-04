'use client'
import React, { useState, useEffect } from 'react';
import { useTakeEntranceTestMutation } from '@/app/redux/features/entry-test/entryTestApi';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Timer, Headphones, BookOpen, Pen, Mic, Info, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from "../ui/checkbox";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

const TakeEntryTest = ({ test }) => {
    if (!test) return null;
    
    console.log('Test data in TakeEntryTest:', test);
    const router = useRouter();
    const [answers, setAnswers] = useState({});
    const [takeEntranceTest] = useTakeEntranceTestMutation();
    const [timeRemaining, setTimeRemaining] = useState(test?.totalTime * 60);
    const [isTestSubmitted, setIsTestSubmitted] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Timer effect
    useEffect(() => {
        if (timeRemaining > 0 && !isTestSubmitted) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else if (timeRemaining === 0) {
            handleSubmitTest();
        }
    }, [timeRemaining, isTestSubmitted]);

    const getSectionIcon = (name) => {
        switch (name) {
            case 'Listening':
                return <Headphones className="h-5 w-5" />;
            case 'Reading':
                return <BookOpen className="h-5 w-5" />;
            case 'Writing':
                return <Pen className="h-5 w-5" />;
            case 'Speaking':
                return <Mic className="h-5 w-5" />;
            default:
                return null;
        }
    };

    const renderImage = (imageUrl) => {
        if (!imageUrl) return null;
        if (imageUrl.includes('cloudinary')) {
            return (
                <div className="mt-4 relative max-w-2xl mx-auto">
                    <img
                        src={imageUrl}
                        alt="Test content"
                        className="rounded-lg w-full h-auto max-h-[500px] object-contain"
                        loading="lazy"
                    />
                    <Progress
                        value={100}
                        className="w-full mt-2 hidden image-loading"
                    />
                </div>
            );
        }
        return null;
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const renderQuestionContent = (question) => {
        const baseContent = (
            <>
                {question.audioFile && (
                    <div className="mt-4 max-w-2xl mx-auto">
                        <div className="bg-secondary/10 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                                <Headphones className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">Audio Question</span>
                            </div>
                            <audio 
                                controls 
                                className="w-full focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <source src={question.audioFile} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                )}
                {question.imageFile && renderImage(question.imageFile)}
                {renderDefaultQuestionContent(question)}
            </>
        );

        return (
            <div className="space-y-4">
                {baseContent}
                {question.type === 'matching' && <Separator className="my-4" />}
            </div>
        );
    };

    const renderDefaultQuestionContent = (question) => {
        switch (question.type) {
            case 'multipleChoice':
                return (
                    <RadioGroup 
                        value={answers[question._id] || ''}
                        onValueChange={(value) => handleAnswerChange(question._id, value)}
                    >
                        <div className="space-y-3">
                            {question.options?.map((option, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.text} id={`${question._id}-option-${idx}`} />
                                    <Label htmlFor={`${question._id}-option-${idx}`}>
                                        {option.text}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                );

            case 'trueFalse':
                return (
                    <RadioGroup
                        value={answers[question._id]?.toString() || ''}
                        onValueChange={(value) => handleAnswerChange(question._id, value)}
                    >
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id={`${question._id}-true`} />
                                <Label htmlFor={`${question._id}-true`}>True</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id={`${question._id}-false`} />
                                <Label htmlFor={`${question._id}-false`}>False</Label>
                            </div>
                        </div>
                    </RadioGroup>
                );

            case 'shortAnswer':
            case 'fillInTheBlank':
                return (
                    <Input 
                        placeholder="Type your answer here"
                        value={answers[question._id] || ''}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        className="mt-2"
                    />
                );

            case 'essay':
                return (
                    <Textarea 
                        placeholder="Write your essay here"
                        value={answers[question._id] || ''}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        className="mt-2 h-32"
                    />
                );

            case 'ordering':
                return (
                    <div className="space-y-2">
                        {question.orderItems?.map((item, idx) => (
                            <Card key={idx} className="p-2">
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        min="1"
                                        max={question.orderItems.length}
                                        value={answers[question._id]?.[idx] || ''}
                                        onChange={(e) => {
                                            const newOrder = [...(answers[question._id] || Array(question.orderItems.length).fill(''))];
                                            newOrder[idx] = parseInt(e.target.value);
                                            handleAnswerChange(question._id, newOrder);
                                        }}
                                        className="w-16"
                                        placeholder="#"
                                    />
                                    <span>{item}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                );

            case 'selectFromDropdown':
                return (
                    <Select 
                        value={answers[question._id]}
                        onValueChange={(value) => handleAnswerChange(question._id, value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            {question.options?.map((option, idx) => (
                                <SelectItem key={idx} value={option.text}>
                                    {option.text}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'matching':
                return (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="space-y-2">
                            {question.matchingPairs?.map((pair, idx) => (
                                <Card key={idx} className="p-2">
                                    <p>{pair.left}</p>
                                </Card>
                            ))}
                        </div>
                        <div className="space-y-2">
                            {question.matchingPairs?.map((pair, idx) => (
                                <Card key={idx} className="p-2">
                                    <Input 
                                        placeholder={`Match for item ${idx + 1}`}
                                        value={answers[question._id]?.[idx] || ''}
                                        onChange={(e) => {
                                            const newMatches = [...(answers[question._id] || Array(question.matchingPairs.length).fill(''))];
                                            newMatches[idx] = e.target.value;
                                            handleAnswerChange(question._id, newMatches);
                                        }}
                                    />
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderPassageContent = (passage, questions) => (
        <div className="space-y-4">
            <Card className="p-4">
                <div className="prose max-w-none">
                    {passage.text}
                </div>
                {passage.audioFile && (
                    <div className="mt-4 max-w-2xl mx-auto">
                        <div className="bg-secondary/10 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                                <Headphones className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">Audio Player</span>
                            </div>
                            <audio 
                                controls 
                                className="w-full focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <source src={passage.audioFile} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                )}
                {passage.imageFile && renderImage(passage.imageFile)}
            </Card>

            <Separator className="my-6" />

            <div className="space-y-4">
                {questions.map((question, qIdx) => (
                    <Card key={qIdx} className="p-4">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium">Question {qIdx + 1}</h4>
                                <Badge>{question.points} points</Badge>
                            </div>
                            <p>{question.text}</p>
                            {renderQuestionContent(question)}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const handleSubmitTest = async () => {
        try {
            const response = await takeEntranceTest({
                testId: test._id,
                answers: answers
            }).unwrap();
            
            setIsTestSubmitted(true);
            toast.success('Test submitted successfully!');
            router.push('/entry-tests/recommendation-courses');
        } catch (error) {
            toast.error('Failed to submit test');
        }
    };

    const handleConfirmSubmit = () => {
        setShowConfirmDialog(false);
        handleSubmitTest();
    };

    return (
        <div className="container mx-auto p-4 space-y-6 mb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">{test.title}</h1>
                    <p className="text-muted-foreground mt-2">{test.description}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-lg">
                        <Clock className="mr-2 h-4 w-4" />
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </Badge>
                    <Button onClick={() => setShowConfirmDialog(true)} disabled={isTestSubmitted}>
                        Submit
                    </Button>
                </div>
            </div>

            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Test Information</AlertTitle>
                <AlertDescription>
                    This is a {test.testType} format test. You have {test.totalTime} minutes to complete it.
                </AlertDescription>
            </Alert>

            <Accordion type="single" collapsible className="w-full">
                {test.sections?.map((section, idx) => (
                    <AccordionItem key={idx} value={`section-${idx}`}>
                        <AccordionTrigger>
                            <div className="flex items-center space-x-2">
                                {getSectionIcon(section.name)}
                                <span>{section.name}</span>
                                <Badge variant="secondary" className="ml-2">
                                    {section.timeLimit} min
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">{section.description}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {section.passages?.length > 0 ? (
                                        section.passages.map((passage, pIdx) => (
                                            <div key={pIdx} className="mt-4">
                                                <h3 className="text-lg font-medium mb-4">Part {pIdx + 1}</h3>
                                                {renderPassageContent(passage, passage.questions)}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="space-y-4">
                                            {section.questions?.map((question, qIdx) => (
                                                <Card key={qIdx} className="p-4">
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="font-medium">Question {qIdx + 1}</h4>
                                                            <Badge>{question.points} points</Badge>
                                                        </div>
                                                        <p>{question.text}</p>
                                                        {renderQuestionContent(question)}
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Test Submission</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to submit your test? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex space-x-2">
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmSubmit}>
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TakeEntryTest;