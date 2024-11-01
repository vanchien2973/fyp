import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../ui/form";
import { PlusCircle, Edit3, Headphones, BookOpen, Pen, Mic, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useGetAllEntranceTestsQuery, useUpdateEntranceTestMutation } from '@/app/redux/features/entry-test/entryTestApi';
import toast from 'react-hot-toast';
import AnswerInput from './AnswerInput';
import { formSchema } from '@/lib/form-schema';
import { redirect } from 'next/navigation';
import FilePreview from './FilePreview';
import Loader from '../../Loader/Loader';
import { useGetHeroDataQuery } from '@/app/redux/features/layout/layoutApi';

const EditEntryTest = ({ id }) => {
    const { data, isLoading } = useGetAllEntranceTestsQuery({}, { refetchOnMountOrArgChange: true });
    const editEntryTest = data && data.tests?.find((i) => i._id === id);
    const [updateEntranceTest, { isLoading: isUpdating, isSuccess, error }] = useUpdateEntranceTestMutation();
    const [files, setFiles] = useState({});
    const [collapsedSections, setCollapsedSections] = useState({});
    const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
    const [testTypes, setTestTypes] = useState([]);

    console.log(editEntryTest)

    const createFilePath = (sectionIndex, questionIndex, fieldName, passageIndex = null) => {
        if (passageIndex !== null) {
            return `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].${fieldName}`;
        }
        return `sections[${sectionIndex}].questions[${questionIndex}].${fieldName}`;
    };

    const handleFileChange = (event, path) => {
        const newFiles = Array.from(event.target.files);
        if (!newFiles.length) return;

        const file = newFiles[0];

        setFiles(prevFiles => ({
            ...prevFiles,
            [path]: file
        }));

        form.setValue(path, file, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const [entryTestData, setEntryTestData] = useState({
        title: '',
        description: '',
        testType: '',
        sections: [],
        totalTime: 0,
    });

    console.log(editEntryTest?.testType)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: editEntryTest?.title || '',
            description: editEntryTest?.description || '',
            testType: editEntryTest?.testType,
            sections: editEntryTest?.sections || [],
            totalTime: editEntryTest?.totalTime || 0,
        },
        mode: 'onChange',
        criteriaMode: 'all'
    });

    useEffect(() => {
        form.reset(entryTestData);
    }, []);

    const { fields: sectionFields, append: appendSection } = useFieldArray({
        control: form.control,
        name: "sections"
    });

    const processQuestionData = (question) => {
        let processedCorrectAnswer = question.correctAnswer ?? '';

        if (question.type === 'multipleChoice' && Array.isArray(question.options)) {
            const correctIndex = question.options.findIndex(opt => opt.isCorrect);
            processedCorrectAnswer = correctIndex >= 0 ? correctIndex.toString() : '';
        }

        return {
            ...question,
            correctAnswer: processedCorrectAnswer,
            options: Array.isArray(question.options) ? question.options : [],
            orderItems: Array.isArray(question.orderItems) ? question.orderItems : [],
            matchingPairs: Array.isArray(question.matchingPairs) ? question.matchingPairs : []
        };
    };

    useEffect(() => {
        if (editEntryTest) {
            const formattedData = {
                title: editEntryTest.title || '',
                description: editEntryTest.description || '',
                testType: editEntryTest.testType,
                totalTime: editEntryTest.totalTime || 180,
                sections: editEntryTest.sections.map(section => ({
                    name: section.name || '',
                    description: section.description || '',
                    timeLimit: section.timeLimit || 0,
                    passages: Array.isArray(section.passages) ? section.passages.map(passage => ({
                        text: passage.text || '',
                        audioFile: passage.audioFile || null,
                        imageFile: passage.imageFile || null,
                        questions: Array.isArray(passage.questions) ? passage.questions.map(processQuestionData) : []
                    })) : [],
                    questions: Array.isArray(section.questions) ? section.questions.map(processQuestionData) : []
                }))
            };
            console.log("Setting form data:", formattedData);
            Object.entries(formattedData).forEach(([key, value]) => {
                form.setValue(key, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            });
            setEntryTestData(formattedData);
        }
    }, [editEntryTest]);

    const urlToFile = async (url, fileName, mimeType) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], fileName, { type: mimeType });
    };

    useEffect(() => {
        const loadExistingFiles = async () => {
            if (editEntryTest) {
                const existingFiles = {};
                for (let sectionIndex = 0; sectionIndex < editEntryTest.sections.length; sectionIndex++) {
                    const section = editEntryTest.sections[sectionIndex];

                    if (section.passages) {
                        for (let passageIndex = 0; passageIndex < section.passages.length; passageIndex++) {
                            const passage = section.passages[passageIndex];

                            if (passage.audioFile) {
                                const path = `sections[${sectionIndex}].passages[${passageIndex}].audioFile`;
                                const file = await urlToFile(
                                    passage.audioFile,
                                    'audio.mp3',
                                    'audio/mpeg'
                                );
                                if (file) {
                                    existingFiles[path] = file;
                                    form.setValue(path, file);
                                }
                            }

                            if (passage.imageFile) {
                                const path = `sections[${sectionIndex}].passages[${passageIndex}].imageFile`;
                                const file = await urlToFile(
                                    passage.imageFile,
                                    'image.jpg',
                                    'image/jpeg'
                                );
                                if (file) {
                                    existingFiles[path] = file;
                                    form.setValue(path, file);
                                }
                            }

                            if (passage.questions) {
                                for (let questionIndex = 0; questionIndex < passage.questions.length; questionIndex++) {
                                    const question = passage.questions[questionIndex];

                                    if (question.audioFile) {
                                        const path = `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].audioFile`;
                                        const file = await urlToFile(
                                            question.audioFile,
                                            'audio.mp3',
                                            'audio/mpeg'
                                        );
                                        if (file) {
                                            existingFiles[path] = file;
                                            form.setValue(path, file);
                                        }
                                    }

                                    if (question.imageFile) {
                                        const path = `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].imageFile`;
                                        const file = await urlToFile(
                                            question.imageFile,
                                            'image.jpg',
                                            'image/jpeg'
                                        );
                                        if (file) {
                                            existingFiles[path] = file;
                                            form.setValue(path, file);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (section.questions) {
                        for (let questionIndex = 0; questionIndex < section.questions.length; questionIndex++) {
                            const question = section.questions[questionIndex];

                            if (question.audioFile) {
                                const path = `sections[${sectionIndex}].questions[${questionIndex}].audioFile`;
                                const file = await urlToFile(
                                    question.audioFile,
                                    'audio.mp3',
                                    'audio/mpeg'
                                );
                                if (file) {
                                    existingFiles[path] = file;
                                    form.setValue(path, file);
                                }
                            }

                            if (question.imageFile) {
                                const path = `sections[${sectionIndex}].questions[${questionIndex}].imageFile`;
                                const file = await urlToFile(
                                    question.imageFile,
                                    'image.jpg',
                                    'image/jpeg'
                                );
                                if (file) {
                                    existingFiles[path] = file;
                                    form.setValue(path, file);
                                }
                            }
                        }
                    }
                }
                setFiles(existingFiles);
            }
        };

        loadExistingFiles();
    }, [editEntryTest, form]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Entrance test updated successfully!");
            setFiles({});
            redirect("/admin/entry-test");
        }
        if (error) {
            if ("data" in error) {
                const errMessage = error;
                toast.error(errMessage?.data.message);
            }
        }
    }, [isSuccess, isUpdating, error]);

    const toggleSection = (sectionIndex) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionIndex]: !prev[sectionIndex]
        }));
    };

    const handleAddPassage = (sectionIndex) => {
        const newPassage = {
            text: '',
            questions: [],
            audioFile: null,
            imageFile: null
        };

        const currentPassages = form.getValues(`sections.${sectionIndex}.passages`) || [];
        form.setValue(`sections.${sectionIndex}.passages`, [...currentPassages, newPassage], {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        });

        setEntryTestData(prevData => {
            const updatedSections = [...prevData.sections];
            if (!updatedSections[sectionIndex].passages) {
                updatedSections[sectionIndex].passages = [];
            }
            updatedSections[sectionIndex].passages.push(newPassage);
            return { ...prevData, sections: updatedSections };
        });
    };

    const handleAddQuestion = (sectionIndex, passageIndex = null) => {
        const createNewQuestion = (type = 'multipleChoice') => {
            const baseQuestion = {
                type,
                text: '',
                points: 1,
                audioFile: null,
                imageFile: null
            };

            switch (type) {
                case 'multipleChoice':
                case 'selectFromDropdown':
                    return {
                        ...baseQuestion,
                        options: [
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false }
                        ],
                        correctAnswer: '',
                        orderItems: [],
                        matchingPairs: []
                    };
                case 'trueFalse':
                    return {
                        ...baseQuestion,
                        options: ['True', 'False'],
                        correctAnswer: false,
                        orderItems: [],
                        matchingPairs: []
                    };
                case 'matching':
                    return {
                        ...baseQuestion,
                        options: [],
                        correctAnswer: '',
                        orderItems: [],
                        matchingPairs: [{ left: '', right: '' }]
                    };
                case 'ordering':
                    return {
                        ...baseQuestion,
                        options: [],
                        correctAnswer: '',
                        orderItems: [''],
                        matchingPairs: []
                    };
                case 'fillInTheBlank':
                case 'shortAnswer':
                case 'essay':
                    return {
                        ...baseQuestion,
                        options: [],
                        correctAnswer: '',
                        orderItems: [],
                        matchingPairs: []
                    };
                default:
                    return baseQuestion;
            }
        };

        const newQuestion = createNewQuestion();

        if (passageIndex !== null) {
            const currentQuestions = form.getValues(`sections.${sectionIndex}.passages.${passageIndex}.questions`) || [];
            form.setValue(
                `sections.${sectionIndex}.passages.${passageIndex}.questions`,
                [...currentQuestions, newQuestion],
                {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                }
            );

            setEntryTestData(prevData => {
                const updatedSections = [...prevData.sections];
                if (!updatedSections[sectionIndex].passages[passageIndex].questions) {
                    updatedSections[sectionIndex].passages[passageIndex].questions = [];
                }
                updatedSections[sectionIndex].passages[passageIndex].questions.push(newQuestion);
                return { ...prevData, sections: updatedSections };
            });
        } else {
            const currentQuestions = form.getValues(`sections.${sectionIndex}.questions`) || [];
            form.setValue(
                `sections.${sectionIndex}.questions`,
                [...currentQuestions, newQuestion],
                {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                }
            );

            setEntryTestData(prevData => {
                const updatedSections = [...prevData.sections];
                if (!updatedSections[sectionIndex].questions) {
                    updatedSections[sectionIndex].questions = [];
                }
                updatedSections[sectionIndex].questions.push(newQuestion);
                return { ...prevData, sections: updatedSections };
            });
        }

        form.trigger();
    };

    const handleQuestionChange = useCallback((sectionIndex, questionIndex, field, value, passageIndex = null) => {
        setEntryTestData(prevData => {
            const updatedSections = JSON.parse(JSON.stringify(prevData.sections));
            const targetQuestions = passageIndex !== null
                ? updatedSections[sectionIndex].passages[passageIndex].questions
                : updatedSections[sectionIndex].questions;

            if (field === 'type') {
                const baseQuestion = {
                    type: value,
                    text: targetQuestions[questionIndex].text || '',
                    points: ['shortAnswer', 'essay'].includes(value) ? 0 : (targetQuestions[questionIndex].points || 1),
                    audioFile: targetQuestions[questionIndex].audioFile || null,
                    imageFile: targetQuestions[questionIndex].imageFile || null,
                };

                let updatedQuestion;
                switch (value) {
                    case 'multipleChoice':
                    case 'selectFromDropdown':
                        updatedQuestion = {
                            ...baseQuestion,
                            options: [
                                { text: '', isCorrect: false },
                                { text: '', isCorrect: false },
                                { text: '', isCorrect: false },
                                { text: '', isCorrect: false }
                            ],
                            correctAnswer: '',
                            orderItems: [],
                            matchingPairs: []
                        };
                        break;
                    case 'trueFalse':
                        updatedQuestion = {
                            ...baseQuestion,
                            options: ['True', 'False'],
                            correctAnswer: false,
                            orderItems: [],
                            matchingPairs: []
                        };
                        break;
                    case 'matching':
                        updatedQuestion = {
                            ...baseQuestion,
                            options: [],
                            correctAnswer: '',
                            orderItems: [],
                            matchingPairs: [{ left: '', right: '' }]
                        };
                        break;
                    case 'ordering':
                        updatedQuestion = {
                            ...baseQuestion,
                            options: [],
                            correctAnswer: '',
                            orderItems: [''],
                            matchingPairs: []
                        };
                        break;
                    case 'fillInTheBlank':
                    case 'shortAnswer':
                    case 'essay':
                        updatedQuestion = {
                            ...baseQuestion,
                            options: [],
                            correctAnswer: '',
                            orderItems: [],
                            matchingPairs: []
                        };
                        break;
                    default:
                        updatedQuestion = baseQuestion;
                }

                targetQuestions[questionIndex] = updatedQuestion;

                const path = passageIndex !== null
                    ? `sections.${sectionIndex}.passages.${passageIndex}.questions.${questionIndex}`
                    : `sections.${sectionIndex}.questions.${questionIndex}`;
                form.setValue(path, updatedQuestion, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                });
            } else {
                targetQuestions[questionIndex] = {
                    ...targetQuestions[questionIndex],
                    [field]: value
                };
            }

            return { ...prevData, sections: updatedSections };
        });
    }, [form]);

    const renderFileInput = (path, accept, label) => {
        const currentFile = files[path];

        return (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <div className="space-y-2">
                    <FormControl>
                        <Input
                            type="file"
                            accept={accept}
                            onChange={(e) => handleFileChange(e, path)}
                        />
                    </FormControl>
                    {currentFile && (
                        <FilePreview
                            file={currentFile}
                            type={accept}
                            onRemove={() => {
                                const newFiles = { ...files };
                                delete newFiles[path];
                                setFiles(newFiles);
                                form.setValue(path, null);
                            }}
                        />
                    )}
                    <FormMessage />
                </div>
            </FormItem>
        );
    };

    const renderQuestionFields = (sectionIndex, questionIndex, passageIndex = null) => {
        const questionPath = passageIndex !== null
            ? `sections.${sectionIndex}.passages.${passageIndex}.questions.${questionIndex}`
            : `sections.${sectionIndex}.questions.${questionIndex}`;

        const question = passageIndex !== null
            ? form.watch(`sections.${sectionIndex}.passages.${passageIndex}.questions.${questionIndex}`)
            : form.watch(`sections.${sectionIndex}.questions.${questionIndex}`);

        return (
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name={`${questionPath}.type`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question Type</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    handleQuestionChange(sectionIndex, questionIndex, 'type', value, passageIndex);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select question type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
                                    <SelectItem value="trueFalse">True/False</SelectItem>
                                    <SelectItem value="shortAnswer">Short Answer</SelectItem>
                                    <SelectItem value="essay">Essay</SelectItem>
                                    <SelectItem value="fillInTheBlank">Fill in the Blank</SelectItem>
                                    <SelectItem value="matching">Matching</SelectItem>
                                    <SelectItem value="ordering">Ordering</SelectItem>
                                    <SelectItem value="selectFromDropdown">Select from Dropdown</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${questionPath}.text`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question Text</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Enter question text"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleQuestionChange(sectionIndex, questionIndex, 'text', e.target.value, passageIndex);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <AnswerInput
                    question={question}
                    sectionIndex={sectionIndex}
                    questionIndex={questionIndex}
                    handleQuestionChange={handleQuestionChange}
                    passageIndex={passageIndex}
                    form={form}
                    isEdit={true}
                />
                <FormField
                    control={form.control}
                    name={`${questionPath}.points`}
                    render={({ field }) => {
                        const questionType = form.watch(`${questionPath}.type`);
                        const isAutoGraded = !['shortAnswer', 'essay'].includes(questionType);

                        return (
                            <FormItem>
                                <FormLabel>Points</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={isAutoGraded ? field.value : 0}
                                        disabled={!isAutoGraded}
                                        onChange={(e) => {
                                            if (!isAutoGraded) return;
                                            const value = Number(e.target.value);
                                            field.onChange(value);
                                            handleQuestionChange(sectionIndex, questionIndex, 'points', value, passageIndex);
                                        }}
                                    />
                                </FormControl>
                                {!isAutoGraded && (
                                    <FormDescription className="text-yellow-600">
                                        This question requires manual grading
                                    </FormDescription>
                                )}
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name={`${questionPath}.audioFile`}
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                                <FormLabel>Audio File</FormLabel>
                                <div className="space-y-2">
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="audio/*"
                                            onChange={(e) => {
                                                const filePath = createFilePath(sectionIndex, questionIndex, 'audioFile', passageIndex);
                                                handleFileChange(e, filePath);

                                                setEntryTestData(prevData => {
                                                    const newData = { ...prevData };
                                                    const sections = [...newData.sections];
                                                    if (passageIndex !== null) {
                                                        sections[sectionIndex].passages[passageIndex].questions[questionIndex].audioFile = e.target.files[0];
                                                    } else {
                                                        sections[sectionIndex].questions[questionIndex].audioFile = e.target.files[0];
                                                    }
                                                    return { ...newData, sections };
                                                });
                                            }}
                                            {...field}
                                        />
                                    </FormControl>
                                    {files[createFilePath(sectionIndex, questionIndex, 'audioFile', passageIndex)] && (
                                        <FilePreview
                                            file={files[createFilePath(sectionIndex, questionIndex, 'audioFile', passageIndex)]}
                                            type="audio/*"
                                            onRemove={() => {
                                                const filePath = createFilePath(sectionIndex, questionIndex, 'audioFile', passageIndex);
                                                const newFiles = { ...files };
                                                delete newFiles[filePath];
                                                setFiles(newFiles);
                                                form.setValue(filePath, null);

                                                setEntryTestData(prevData => {
                                                    const newData = { ...prevData };
                                                    const sections = [...newData.sections];
                                                    if (passageIndex !== null) {
                                                        sections[sectionIndex].passages[passageIndex].questions[questionIndex].audioFile = null;
                                                    } else {
                                                        sections[sectionIndex].questions[questionIndex].audioFile = null;
                                                    }
                                                    return { ...newData, sections };
                                                });
                                            }}
                                        />
                                    )}
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={`${questionPath}.imageFile`}
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                                <FormLabel>Image File</FormLabel>
                                <div className="space-y-2">
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const filePath = createFilePath(sectionIndex, questionIndex, 'imageFile', passageIndex);
                                                handleFileChange(e, filePath);

                                                // Update entryTestData
                                                setEntryTestData(prevData => {
                                                    const newData = { ...prevData };
                                                    const sections = [...newData.sections];
                                                    if (passageIndex !== null) {
                                                        sections[sectionIndex].passages[passageIndex].questions[questionIndex].imageFile = e.target.files[0];
                                                    } else {
                                                        sections[sectionIndex].questions[questionIndex].imageFile = e.target.files[0];
                                                    }
                                                    return { ...newData, sections };
                                                });
                                            }}
                                            {...field}
                                        />
                                    </FormControl>
                                    {files[createFilePath(sectionIndex, questionIndex, 'imageFile', passageIndex)] && (
                                        <FilePreview
                                            file={files[createFilePath(sectionIndex, questionIndex, 'imageFile', passageIndex)]}
                                            type="image/*"
                                            onRemove={() => {
                                                const filePath = createFilePath(sectionIndex, questionIndex, 'imageFile', passageIndex);
                                                const newFiles = { ...files };
                                                delete newFiles[filePath];
                                                setFiles(newFiles);
                                                form.setValue(filePath, null);

                                                // Update entryTestData
                                                setEntryTestData(prevData => {
                                                    const newData = { ...prevData };
                                                    const sections = [...newData.sections];
                                                    if (passageIndex !== null) {
                                                        sections[sectionIndex].passages[passageIndex].questions[questionIndex].imageFile = null;
                                                    } else {
                                                        sections[sectionIndex].questions[questionIndex].imageFile = null;
                                                    }
                                                    return { ...newData, sections };
                                                });
                                            }}
                                        />
                                    )}
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        );
    };

    const renderPassageContent = (sectionIndex, passageIndex) => (
        <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Part {passageIndex + 1}</CardTitle>
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeletePassage(sectionIndex, passageIndex)}
                    className="h-8 w-8"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name={`sections.${sectionIndex}.passages.${passageIndex}.text`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Part Text</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Enter passage text"
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setEntryTestData(prev => {
                                            const newSections = [...prev.sections];
                                            newSections[sectionIndex].passages[passageIndex].text = e.target.value;
                                            return { ...prev, sections: newSections };
                                        });
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {renderFileInput(`sections[${sectionIndex}].passages[${passageIndex}].audioFile`, "audio/*", "Audio File")}
                    {renderFileInput(`sections[${sectionIndex}].passages[${passageIndex}].imageFile`, "image/*", "Image File")}
                </div>
                {form.watch(`sections.${sectionIndex}.passages.${passageIndex}.questions`)?.map((_, questionIndex) => (
                    <Card key={questionIndex} className="mt-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">Question {questionIndex + 1}</CardTitle>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteQuestion(sectionIndex, questionIndex, passageIndex)}
                                className="h-8 w-8"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {renderQuestionFields(sectionIndex, questionIndex, passageIndex)}
                        </CardContent>
                    </Card>
                ))}
                <Button
                    type="button"
                    onClick={() => handleAddQuestion(sectionIndex, passageIndex)}
                    className="mt-4"
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Question to Part
                </Button>
            </CardContent>
        </Card>
    );

    const renderSectionContent = (section, sectionIndex) => {
        const isListeningOrReading = section.name === 'Listening' || section.name === 'Reading';
        const currentSection = form.getValues(`sections.${sectionIndex}`);

        if (isListeningOrReading) {
            return (
                <>
                    {(currentSection.passages || []).map((_, passageIndex) => (
                        renderPassageContent(sectionIndex, passageIndex)
                    ))}
                    <Button
                        type="button"
                        onClick={() => handleAddPassage(sectionIndex)}
                        className="mt-4"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Part
                    </Button>
                </>
            );
        }

        return (
            <>
                {(currentSection.questions || []).map((_, questionIndex) => (
                    <Card key={questionIndex} className="mt-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">Question {questionIndex + 1}</CardTitle>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteQuestion(sectionIndex, questionIndex)}
                                className="h-8 w-8"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {renderQuestionFields(sectionIndex, questionIndex)}
                        </CardContent>
                    </Card>
                ))}
                <Button
                    type="button"
                    onClick={() => handleAddQuestion(sectionIndex)}
                    className="mt-4"
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                </Button>
            </>
        );
    };

    const onSubmit = async (data) => {
        try {
            // Validate answers before submitting
            const hasInvalidQuestions = data.sections.some(section => {
                const questions = section.passages 
                    ? section.passages.flatMap(p => p.questions)
                    : section.questions;
                
                return questions.some(q => {
                    if (q.type === 'shortAnswer' || q.type === 'essay') return false;
                    
                    switch (q.type) {
                        case 'multipleChoice':
                        case 'selectFromDropdown':
                            return !q.options.some(opt => opt.isCorrect);
                        case 'trueFalse':
                            return typeof q.correctAnswer !== 'boolean';
                        case 'matching':
                            return !q.matchingPairs.every(pair => pair.left && pair.right);
                        case 'ordering':
                            return !q.orderItems.every(item => item.trim() !== '');
                        case 'fillInTheBlank':
                            return !q.correctAnswer || q.correctAnswer.trim() === '';
                        default:
                            return false;
                    }
                });
            });

            if (hasInvalidQuestions) {
                toast.error("Please select answers for all questions before updating");
                return;
            }

            const formData = new FormData();

            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('testType', data.testType);
            formData.append('totalTime', data.totalTime.toString());

            const processQuestionData = (question) => {
                const baseQuestion = {
                    type: question.type,
                    text: question.text,
                    points: question.points
                };

                switch (question.type) {
                    case 'multipleChoice':
                    case 'selectFromDropdown':
                        return {
                            ...baseQuestion,
                            options: question.options,
                            correctAnswer: question.options
                                ?.map((opt, index) => opt.isCorrect ? index : -1)
                                .filter(index => index !== -1)
                        };

                    case 'trueFalse':
                        return {
                            ...baseQuestion,
                            correctAnswer: Boolean(question.correctAnswer)
                        };

                    case 'ordering':
                        return {
                            ...baseQuestion,
                            orderItems: question.orderItems,
                            correctAnswer: question.orderItems?.map((_, index) => index)
                        };

                    case 'matching':
                        return {
                            ...baseQuestion,
                            matchingPairs: question.matchingPairs
                        };

                    case 'shortAnswer':
                    case 'essay':
                    case 'fillInTheBlank':
                        return {
                            ...baseQuestion,
                            correctAnswer: question.correctAnswer || ''
                        };

                    default:
                        return baseQuestion;
                }
            };

            const prepareSectionData = (section) => {
                const processPassages = section.passages?.map(passage => ({
                    text: passage.text,
                    questions: passage.questions?.map(processQuestionData)
                }));

                const processQuestions = section.questions?.map(processQuestionData);

                const cleanedSection = {
                    name: section.name,
                    description: section.description,
                    timeLimit: section.timeLimit,
                    ...(processPassages?.length && { passages: processPassages }),
                    ...(processQuestions?.length && { questions: processQuestions })
                };

                Object.keys(cleanedSection).forEach(key =>
                    (cleanedSection[key] === undefined || cleanedSection[key] === null) && delete cleanedSection[key]
                );

                return cleanedSection;
            };

            const processedSections = data.sections.map(prepareSectionData);
            formData.append('sections', JSON.stringify(processedSections));

            const addFileToFormData = (file, path) => {
                if (file instanceof File) {
                    formData.append(path, file);
                }
            };

            data.sections.forEach((section, sectionIndex) => {
                section.passages?.forEach((passage, passageIndex) => {
                    addFileToFormData(
                        passage.audioFile,
                        `sections[${sectionIndex}].passages[${passageIndex}].audioFile`
                    );
                    addFileToFormData(
                        passage.imageFile,
                        `sections[${sectionIndex}].passages[${passageIndex}].imageFile`
                    );

                    passage.questions?.forEach((question, questionIndex) => {
                        addFileToFormData(
                            question.audioFile,
                            `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].audioFile`
                        );
                        addFileToFormData(
                            question.imageFile,
                            `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].imageFile`
                        );
                    });
                });
                section.questions?.forEach((question, questionIndex) => {
                    addFileToFormData(
                        question.audioFile,
                        `sections[${sectionIndex}].questions[${questionIndex}].audioFile`
                    );
                    addFileToFormData(
                        question.imageFile,
                        `sections[${sectionIndex}].questions[${questionIndex}].imageFile`
                    );
                });
            });

            await updateEntranceTest({
                id: editEntryTest._id,
                data: formData
            }).unwrap();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật bài kiểm tra");
        }
    };

    useEffect(() => {
        if (categoriesData?.layout?.categories) {
            const types = categoriesData.layout.categories
                .filter(cat => cat.title && cat.title !== '')
                .map(cat => cat.title);
            const uniqueTypes = [...new Set(types)];
            setTestTypes(uniqueTypes);
        }
    }, [categoriesData]);

    const handleDeleteSection = (sectionIndex) => {
        setEntryTestData(prevData => {
            const updatedSections = prevData.sections.filter((_, index) => index !== sectionIndex);
            return { ...prevData, sections: updatedSections };
        });

        const currentSections = form.getValues('sections');
        form.setValue('sections', 
            currentSections.filter((_, index) => index !== sectionIndex),
            { shouldValidate: true }
        );
    };

    const handleDeletePassage = (sectionIndex, passageIndex) => {
        setEntryTestData(prevData => {
            const updatedSections = [...prevData.sections];
            updatedSections[sectionIndex].passages = 
                updatedSections[sectionIndex].passages.filter((_, index) => index !== passageIndex);
            return { ...prevData, sections: updatedSections };
        });

        const currentPassages = form.getValues(`sections.${sectionIndex}.passages`);
        form.setValue(
            `sections.${sectionIndex}.passages`,
            currentPassages.filter((_, index) => index !== passageIndex),
            { shouldValidate: true }
        );
    };

    const handleDeleteQuestion = (sectionIndex, questionIndex, passageIndex = null) => {
        setEntryTestData(prevData => {
            const updatedSections = [...prevData.sections];
            if (passageIndex !== null) {
                updatedSections[sectionIndex].passages[passageIndex].questions = 
                    updatedSections[sectionIndex].passages[passageIndex].questions.filter((_, index) => index !== questionIndex);
            } else {
                updatedSections[sectionIndex].questions = 
                    updatedSections[sectionIndex].questions.filter((_, index) => index !== questionIndex);
            }
            return { ...prevData, sections: updatedSections };
        });

        if (passageIndex !== null) {
            const currentQuestions = form.getValues(`sections.${sectionIndex}.passages.${passageIndex}.questions`);
            form.setValue(
                `sections.${sectionIndex}.passages.${passageIndex}.questions`,
                currentQuestions.filter((_, index) => index !== questionIndex),
                { shouldValidate: true }
            );
        } else {
            const currentQuestions = form.getValues(`sections.${sectionIndex}.questions`);
            form.setValue(
                `sections.${sectionIndex}.questions`,
                currentQuestions.filter((_, index) => index !== questionIndex),
                { shouldValidate: true }
            );
        }
    };

    const handleAddSection = () => {
        const newSection = {
            name: '',
            description: '',
            timeLimit: 60,
            passages: [],
            questions: []
        };

        setEntryTestData(prevData => ({
            ...prevData,
            sections: [...prevData.sections, newSection]
        }));

        appendSection(newSection);
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <Edit3 className="mr-2" /> Update Entrance Test
            </h1>

            <Button
                type="button"
                onClick={handleAddSection}
                className="mb-4"
            >
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Section
            </Button>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-semibold">Title</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter test title"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setEntryTestData(prev => ({ ...prev, title: e.target.value }));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-semibold">Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Enter test description"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setEntryTestData(prev => ({ ...prev, description: e.target.value }));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="testType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-semibold">Test Type</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setEntryTestData(prev => ({ ...prev, testType: value }));
                                    }}
                                    value={field.value || editEntryTest?.testType}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select test type">
                                                {field.value || editEntryTest?.testType}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {testTypes && testTypes.length > 0 && (
                                            testTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="totalTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-semibold">Total Time (minutes)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            field.onChange(value);
                                            setEntryTestData(prev => ({ ...prev, totalTime: value }));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {sectionFields.map((section, sectionIndex) => (
                        <Card key={section.id} className="mt-6">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center cursor-pointer" onClick={() => toggleSection(sectionIndex)}>
                                    <CardTitle className="flex items-center">
                                        {section.name === 'Listening' && <Headphones className="mr-2" />}
                                        {section.name === 'Reading' && <BookOpen className="mr-2" />}
                                        {section.name === 'Writing' && <Pen className="mr-2" />}
                                        {section.name === 'Speaking' && <Mic className="mr-2" />}
                                        {section.name} Section
                                    </CardTitle>
                                    {collapsedSections[sectionIndex] ? (
                                        <ChevronDown className="h-5 w-5 ml-2" />
                                    ) : (
                                        <ChevronUp className="h-5 w-5 ml-2" />
                                    )}
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteSection(sectionIndex)}
                                    className="h-8 w-8"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>

                            {!collapsedSections[sectionIndex] && (
                                <CardContent>
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name={`sections.${sectionIndex}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Section Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder={`${section.name} section description`}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                setEntryTestData(prev => {
                                                                    const newSections = [...prev.sections];
                                                                    newSections[sectionIndex].description = e.target.value;
                                                                    return { ...prev, sections: newSections };
                                                                });
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`sections.${sectionIndex}.timeLimit`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Time Limit (minutes)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) => {
                                                                const value = Number(e.target.value);
                                                                field.onChange(value);
                                                                setEntryTestData(prev => {
                                                                    const newSections = [...prev.sections];
                                                                    newSections[sectionIndex].timeLimit = value;
                                                                    return { ...prev, sections: newSections };
                                                                });
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {renderSectionContent(section, sectionIndex)}
                                </CardContent>
                            )}
                        </Card>
                    ))}
                    <Button
                        type="submit"
                        className="mt-6 w-full"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Update Entrance Test'}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default EditEntryTest;
