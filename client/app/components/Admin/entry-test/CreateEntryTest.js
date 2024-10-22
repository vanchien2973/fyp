import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { PlusCircle, Edit3, Headphones, BookOpen, Pen, Mic } from 'lucide-react';
import { useCreateEntranceTestMutation } from '@/app/redux/features/entry-test/entryTestApi';
import toast from 'react-hot-toast';
import AnswerInput from './AnswerInput';
import { formSchema } from '@/lib/form-schema';
import sampleEntryTestData from './SampleEntryTest';
import { redirect } from 'next/navigation';

const CreateEntryTest = () => {
  const [createEntranceTest, { isLoading, isSuccess, error }] = useCreateEntranceTestMutation();
  const [files, setFiles] = useState({});

  const createFilePath = (sectionIndex, questionIndex, fieldName, passageIndex = null) => {
    if (passageIndex !== null) {
      return `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].${fieldName}`;
    }
    return `sections[${sectionIndex}].questions[${questionIndex}].${fieldName}`;
  };

  const handleFileChange = (event, path) => {
    const newFiles = Array.from(event.target.files);
    if (!newFiles.length) return;

    // Update files state
    setFiles(prevFiles => ({
      ...prevFiles,
      [path]: newFiles[0]
    }));

    // Update form value with the File object directly
    form.setValue(path, newFiles[0], {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const [entryTestData, setEntryTestData] = useState({
    title: '',
    description: '',
    testType: 'IELTS',
    totalTime: 180,
    sections: [
      {
        name: 'Listening',
        description: '',
        timeLimit: 40,
        passages: [],
        questions: []
      },
      {
        name: 'Reading',
        description: '',
        timeLimit: 60,
        passages: [],
        questions: []
      },
      {
        name: 'Writing',
        description: '',
        timeLimit: 60,
        questions: []
      },
      {
        name: 'Speaking',
        description: '',
        timeLimit: 20,
        questions: []
      }
    ]
  });
  // const [entryTestData, setEntryTestData] = useState(sampleEntryTestData);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: entryTestData
  });

  useEffect(() => {
    form.reset(entryTestData);
  }, []);

  const { fields: sectionFields, append: appendSection } = useFieldArray({
    control: form.control,
    name: "sections"
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Entrance test created successfully!");
      form.reset();
      setFiles({});
      redirect("/admin/entry-test");
    }
    if (error) {
      if ("data" in error) {
        const errMessage = error;
        toast.error(errMessage?.data.message);
      }
    }
  }, [isLoading, isSuccess, error]);

  const handleAddPassage = (sectionIndex) => {
    const newPassage = {
      text: '',
      questions: [],
      audioFile: null,
      imageFile: null
    };

    // Update local state
    setEntryTestData(prevData => {
      const updatedSections = [...prevData.sections];
      if (!updatedSections[sectionIndex].passages) {
        updatedSections[sectionIndex].passages = [];
      }
      updatedSections[sectionIndex].passages.push(newPassage);
      return { ...prevData, sections: updatedSections };
    });

    // Update form state
    const currentPassages = form.getValues(`sections.${sectionIndex}.passages`) || [];
    form.setValue(`sections.${sectionIndex}.passages`, [...currentPassages, newPassage]);
  };

  const handleAddQuestion = (sectionIndex, passageIndex = null) => {
    const newQuestion = {
      type: 'multipleChoice',
      text: '',
      options: [],
      correctAnswer: '',
      points: 1,
      audioFile: null,
      imageFile: null,
      orderItems: [],
      matchingPairs: [],
    };

    // Update local state
    setEntryTestData(prevData => {
      const updatedSections = [...prevData.sections];
      if (passageIndex !== null) {
        if (!updatedSections[sectionIndex].passages[passageIndex].questions) {
          updatedSections[sectionIndex].passages[passageIndex].questions = [];
        }
        updatedSections[sectionIndex].passages[passageIndex].questions.push(newQuestion);
      } else {
        if (!updatedSections[sectionIndex].questions) {
          updatedSections[sectionIndex].questions = [];
        }
        updatedSections[sectionIndex].questions.push(newQuestion);
      }
      return { ...prevData, sections: updatedSections };
    });

    // Update form state
    if (passageIndex !== null) {
      const currentQuestions = form.getValues(`sections.${sectionIndex}.passages.${passageIndex}.questions`) || [];
      form.setValue(
        `sections.${sectionIndex}.passages.${passageIndex}.questions`,
        [...currentQuestions, newQuestion]
      );
    } else {
      const currentQuestions = form.getValues(`sections.${sectionIndex}.questions`) || [];
      form.setValue(
        `sections.${sectionIndex}.questions`,
        [...currentQuestions, newQuestion]
      );
    }
  };

  const handleQuestionChange = useCallback((sectionIndex, questionIndex, field, value, passageIndex = null) => {
    setEntryTestData(prevData => {
      const updatedSections = [...prevData.sections];
      const targetQuestions = passageIndex !== null
        ? updatedSections[sectionIndex].passages[passageIndex].questions
        : updatedSections[sectionIndex].questions;

      if (field === 'type') {
        // Initialize default values based on question type
        const baseQuestion = {
          type: value,
          text: targetQuestions[questionIndex].text || '',
          points: targetQuestions[questionIndex].points || 1,
          audioFile: targetQuestions[questionIndex].audioFile || null,
          imageFile: targetQuestions[questionIndex].imageFile || null,
        };

        // Add specific fields based on question type
        switch (value) {
          case 'multipleChoice':
          case 'selectFromDropdown':
            targetQuestions[questionIndex] = {
              ...baseQuestion,
              options: [],
              correctAnswer: '',
              orderItems: [],
              matchingPairs: []
            };
            break;
          case 'trueFalse':
            targetQuestions[questionIndex] = {
              ...baseQuestion,
              options: [],
              correctAnswer: false,
              orderItems: [],
              matchingPairs: []
            };
            break;
          case 'shortAnswer':
          case 'essay':
          case 'fillInTheBlank':
            targetQuestions[questionIndex] = {
              ...baseQuestion,
              options: [],
              correctAnswer: '',
              orderItems: [],
              matchingPairs: []
            };
            break;
          case 'matching':
            targetQuestions[questionIndex] = {
              ...baseQuestion,
              options: [],
              correctAnswer: '',
              orderItems: [],
              matchingPairs: [{
                left: '',
                right: ''
              }]
            };
            break;
          case 'ordering':
            targetQuestions[questionIndex] = {
              ...baseQuestion,
              options: [],
              correctAnswer: '',
              orderItems: [''],
              matchingPairs: []
            };
            break;
          default:
            targetQuestions[questionIndex] = {
              ...baseQuestion,
              options: [],
              correctAnswer: '',
              orderItems: [],
              matchingPairs: []
            };
        }

        // Update the form values
        const questionPath = passageIndex !== null
          ? `sections.${sectionIndex}.passages.${passageIndex}.questions.${questionIndex}`
          : `sections.${sectionIndex}.questions.${questionIndex}`;
        form.setValue(questionPath, targetQuestions[questionIndex]);
      } else {
        // Handle other field changes
        targetQuestions[questionIndex][field] = value;
      }

      console.log('Updated entryTestData:', updatedSections);
      return { ...prevData, sections: updatedSections };
    });
  }, [form]);

  const renderFileInput = (path, accept) => (
    <FormItem>
      <FormLabel>File Upload</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept={accept}
          multiple
          onChange={(e) => handleFileChange(e, path)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderQuestionFields = (sectionIndex, questionIndex, passageIndex = null) => {
    const questionPath = passageIndex !== null
      ? `sections.${sectionIndex}.passages.${passageIndex}.questions.${questionIndex}`
      : `sections.${sectionIndex}.questions.${questionIndex}`;

    const question = passageIndex !== null
      ? form.watch(`sections.${sectionIndex}.passages.${passageIndex}.questions.${questionIndex}`)
      : form.watch(`sections.${sectionIndex}.questions.${questionIndex}`);

    return (
      <div className="space-y-4">
        {/* Question type field */}
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

        {/* Question text field */}
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

        {/* Answer input component */}
        <AnswerInput
          question={question}
          sectionIndex={sectionIndex}
          questionIndex={questionIndex}
          handleQuestionChange={handleQuestionChange}
          passageIndex={passageIndex}
          form={form}
        />

        {/* Points field */}
        <FormField
          control={form.control}
          name={`${questionPath}.points`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    field.onChange(value);
                    handleQuestionChange(sectionIndex, questionIndex, 'points', value, passageIndex);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File upload fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`${questionPath}.audioFile`}
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Audio File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const filePath = createFilePath(sectionIndex, questionIndex, 'audioFile', passageIndex);
                      handleFileChange(e, filePath);

                      // Update entryTestData
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${questionPath}.imageFile`}
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Image File</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  };

  const renderPassageContent = (sectionIndex, passageIndex) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Passage {passageIndex + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name={`sections.${sectionIndex}.passages.${passageIndex}.text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passage Text</FormLabel>
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
          {renderFileInput(`sections[${sectionIndex}].passages[${passageIndex}].audioFile`, "audio/*")}
          {renderFileInput(`sections[${sectionIndex}].passages[${passageIndex}].imageFile`, "image/*")}
        </div>
        {form.watch(`sections.${sectionIndex}.passages.${passageIndex}.questions`)?.map((_, questionIndex) => (
          <Card key={questionIndex} className="mt-4">
            <CardHeader>
              <CardTitle>Question {questionIndex + 1}</CardTitle>
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
          <PlusCircle className="mr-2 h-4 w-4" /> Add Question to Passage
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
            <PlusCircle className="mr-2 h-4 w-4" /> Add Passage
          </Button>
        </>
      );
    }

    return (
      <>
        {(currentSection.questions || []).map((_, questionIndex) => (
          <Card key={questionIndex} className="mt-4">
            <CardHeader>
              <CardTitle>Question {questionIndex + 1}</CardTitle>
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
      const formData = new FormData();

      // Append basic info
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('testType', data.testType);
      formData.append('totalTime', data.totalTime.toString());

      // Helper function to process question data based on type
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

      // Helper function to clean and validate section data
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

        // Remove undefined/null properties
        Object.keys(cleanedSection).forEach(key =>
          (cleanedSection[key] === undefined || cleanedSection[key] === null) && delete cleanedSection[key]
        );

        return cleanedSection;
      };

      // Process sections data
      const processedSections = data.sections.map(prepareSectionData);
      formData.append('sections', JSON.stringify(processedSections));

      // Process files
      const addFileToFormData = (file, path) => {
        if (file instanceof File) {
          formData.append(path, file);
        }
      };

      // Add files from sections
      data.sections.forEach((section, sectionIndex) => {
        section.passages?.forEach((passage, passageIndex) => {
          // Handle passage files
          addFileToFormData(
            passage.audioFile,
            `sections[${sectionIndex}].passages[${passageIndex}].audioFile`
          );
          addFileToFormData(
            passage.imageFile,
            `sections[${sectionIndex}].passages[${passageIndex}].imageFile`
          );

          // Handle passage question files
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

      await createEntranceTest(formData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Edit3 className="mr-2" /> Create Entrance Test
      </h1>

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
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="IELTS">IELTS</SelectItem>
                    <SelectItem value="TOEIC">TOEIC</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
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
              <CardHeader>
                <CardTitle className="flex items-center">
                  {section.name === 'Listening' && <Headphones className="mr-2" />}
                  {section.name === 'Reading' && <BookOpen className="mr-2" />}
                  {section.name === 'Writing' && <Pen className="mr-2" />}
                  {section.name === 'Speaking' && <Mic className="mr-2" />}
                  {section.name} Section
                </CardTitle>
              </CardHeader>
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
            </Card>
          ))}

          <Button type="submit" className="mt-6 w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Entrance Test'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateEntryTest;
