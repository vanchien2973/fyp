import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Label } from "../../ui/label";
import { PlusCircle, Edit3, Headphones, BookOpen, Pen, Mic } from 'lucide-react';
import { useCreateEntranceTestMutation } from '@/app/redux/features/entry-test/entryTestApi';
import toast from 'react-hot-toast';
import AnswerInput from './AnswerInput';

const fileSchema = z.any()
  .refine((file) => !file || file instanceof File, "Must be a File object or null")
  .nullable()
  .optional();

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean()
});

const matchingPairSchema = z.object({
  left: z.string().min(1, "Left item is required"),
  right: z.string().min(1, "Right item is required")
});

const questionSchema = z.object({
  type: z.enum([
    'multipleChoice',
    'trueFalse',
    'shortAnswer',
    'essay',
    'fillInTheBlank',
    'matching',
    'ordering',
    'selectFromDropdown'
  ]),
  text: z.string().min(1, "Question text is required"),
  options: z.array(optionSchema).optional(),
  matchingPairs: z.array(matchingPairSchema).optional(),
  orderItems: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  points: z.number().min(1, "Points must be greater than 0"),
  timeLimit: z.number().min(0).optional(),
  audioFile: fileSchema,
  imageFile: fileSchema
});

const passageSchema = z.object({
  text: z.string().min(1, "Passage text is required"),
  audioFile: fileSchema,
  imageFile: fileSchema,
  questions: z.array(questionSchema).default([])
});

const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  description: z.string().min(1, "Section description is required"),
  timeLimit: z.number().min(1, "Time limit must be greater than 0"),
  passages: z.array(passageSchema).default([]),
  questions: z.array(questionSchema).default([])
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  testType: z.enum(['IELTS', 'TOEIC', 'Custom']),
  totalTime: z.number().min(1, "Total time must be greater than 0"),
  sections: z.array(sectionSchema)
});

const CreateEntryTest = () => {
  const [createEntranceTest, { isLoading }] = useCreateEntranceTestMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    }
  });

  const { fields: sectionFields } = useFieldArray({
    control: form.control,
    name: "sections"
  });

  const handleAddPassage = (sectionIndex) => {
    const sections = form.getValues('sections');
    const updatedSections = [...sections];
    updatedSections[sectionIndex].passages.push({
      text: '',
      questions: [],
      audioFile: null,
      imageFile: null
    });
    form.setValue(`sections`, updatedSections);
  };

  const handleAddQuestion = (sectionIndex, passageIndex = null) => {
    const sections = form.getValues('sections');
    const updatedSections = [...sections];
    const newQuestion = {
      type: 'multipleChoice',
      text: '',
      options: [],
      correctAnswer: '',
      points: 1,
      audioFile: null,
      imageFile: null,
      timeLimit: 0
    };

    if (passageIndex !== null) {
      updatedSections[sectionIndex].passages[passageIndex].questions.push(newQuestion);
    } else {
      updatedSections[sectionIndex].questions.push(newQuestion);
    }
    form.setValue(`sections`, updatedSections);
  };

  const renderQuestionFields = (sectionIndex, questionIndex, passageIndex = null) => {
    const questionPath = passageIndex !== null
      ? `sections.${sectionIndex}.passages.${passageIndex}.questions.${questionIndex}`
      : `sections.${sectionIndex}.questions.${questionIndex}`;

    const question = passageIndex !== null
      ? form.watch(`sections.${sectionIndex}.passages.${passageIndex}.questions.${questionIndex}`)
      : form.watch(`sections.${sectionIndex}.questions.${questionIndex}`);

    const handleQuestionChange = (sectionIndex, questionIndex, field, value, passageIndex = null) => {
      const sections = form.getValues('sections');
      const updatedSections = [...sections];
      
      if (passageIndex !== null) {
        updatedSections[sectionIndex].passages[passageIndex].questions[questionIndex][field] = value;
      } else {
        updatedSections[sectionIndex].questions[questionIndex][field] = value;
      }
      
      form.setValue('sections', updatedSections);
    };

    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`${questionPath}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Textarea {...field} placeholder="Enter question text" />
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
        />

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
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    onChange={(e) => onChange(e.target.files?.[0] || null)}
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
                    onChange={(e) => onChange(e.target.files?.[0] || null)}
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
                <Textarea {...field} placeholder="Enter passage text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormField
            control={form.control}
            name={`sections.${sectionIndex}.passages.${passageIndex}.audioFile`}
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Audio File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => onChange(e.target.files?.[0] || null)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`sections.${sectionIndex}.passages.${passageIndex}.imageFile`}
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Image File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files?.[0] || null)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

    if (isListeningOrReading) {
      return (
        <>
          {form.watch(`sections.${sectionIndex}.passages`)?.map((_, passageIndex) => (
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
        {form.watch(`sections.${sectionIndex}.questions`)?.map((_, questionIndex) => (
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
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append basic test information
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('testType', data.testType);
      formData.append('totalTime', data.totalTime.toString());

      // Create a copy of sections for JSON with file references
      const sectionsForJson = data.sections.map((section, sectionIndex) => ({
        ...section,
        passages: section.passages?.map((passage, passageIndex) => ({
          ...passage,
          audioFile: passage.audioFile ? `sections[${sectionIndex}].passages[${passageIndex}].audioFile` : null,
          imageFile: passage.imageFile ? `sections[${sectionIndex}].passages[${passageIndex}].imageFile` : null,
          questions: passage.questions.map((question, questionIndex) => ({
            ...question,
            audioFile: question.audioFile ? `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].audioFile` : null,
            imageFile: question.imageFile ? `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].imageFile` : null,
          }))
        })),
        questions: section.questions.map((question, questionIndex) => ({
          ...question,
          audioFile: question.audioFile ? `sections[${sectionIndex}].questions[${questionIndex}].audioFile` : null,
          imageFile: question.imageFile ? `sections[${sectionIndex}].questions[${questionIndex}].imageFile` : null,
        }))
      }));

      // Append sections JSON with file references
      formData.append('sections', JSON.stringify(sectionsForJson));

      // Append actual files with matching keys
      data.sections.forEach((section, sectionIndex) => {
        section.passages?.forEach((passage, passageIndex) => {
          if (passage.audioFile instanceof File) {
            const key = `sections[${sectionIndex}].passages[${passageIndex}].audioFile`;
            formData.append(key, passage.audioFile);
          }
          if (passage.imageFile instanceof File) {
            const key = `sections[${sectionIndex}].passages[${passageIndex}].imageFile`;
            formData.append(key, passage.imageFile);
          }

          passage.questions.forEach((question, questionIndex) => {
            if (question.audioFile instanceof File) {
              const key = `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].audioFile`;
              formData.append(key, question.audioFile);
            }
            if (question.imageFile instanceof File) {
              const key = `sections[${sectionIndex}].passages[${passageIndex}].questions[${questionIndex}].imageFile`;
              formData.append(key, question.imageFile);
            }
          });
        });

        section.questions.forEach((question, questionIndex) => {
          if (question.audioFile instanceof File) {
            const key = `sections[${sectionIndex}].questions[${questionIndex}].audioFile`;
            formData.append(key, question.audioFile);
          }
          if (question.imageFile instanceof File) {
            const key = `sections[${sectionIndex}].questions[${questionIndex}].imageFile`;
            formData.append(key, question.imageFile);
          }
        });
      });

      const response = await createEntranceTest(formData);
      if (response.data?.success) {
        toast.success('Entrance test created successfully!');
        form.reset();
      } else {
        toast.error(`Failed to create entrance test: ${response.error?.data?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast.error(`An error occurred: ${error.message || 'Unknown error'}`);
    }
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
                  <Input {...field} placeholder="Enter test title" />
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
                  <Textarea {...field} placeholder="Enter test description" />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                          <Textarea {...field} placeholder={`${section.name} section description`} />
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
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {renderSectionContent(section, sectionIndex)}
                </div>
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
