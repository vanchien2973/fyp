import React, { useState } from 'react';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { PlusCircle, Edit3, Headphones, BookOpen, Pen, Mic } from 'lucide-react';
import { useCreateEntranceTestMutation } from '@/app/redux/features/entry-test/entryTestApi';
import toast from 'react-hot-toast';
import AnswerInput from './AnswerInput';

const CreateEntryTest = () => {
  const [createEntranceTest, { isLoading }] = useCreateEntranceTestMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [testType, setTestType] = useState('IELTS');
  const [totalTime, setTotalTime] = useState(180);
  const [passingScore, setPassingScore] = useState(65);
  const [sections, setSections] = useState([
    { name: 'Listening', description: '', timeLimit: 40, questions: [] },
    { name: 'Reading', description: '', timeLimit: 60, passages: [], questions: [] },
    { name: 'Writing', description: '', timeLimit: 60, questions: [] },
    { name: 'Speaking', description: '', timeLimit: 20, questions: [] }
  ]);

  const handleSectionChange = (sectionIndex, field, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex][field] = value;
    setSections(updatedSections);
  };

  const handleAddPassage = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].passages.push({ text: '', questions: [] });
    setSections(updatedSections);
  };

  const handlePassageChange = (sectionIndex, passageIndex, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].passages[passageIndex].text = value;
    setSections(updatedSections);
  };

  const handleAddQuestion = (sectionIndex, passageIndex = null) => {
    const newQuestion = {
      type: 'multipleChoice',
      text: '',
      options: [],
      correctAnswer: '',
      points: 1,
      audioFile: null,
      imageFile: null
    };

    const updatedSections = [...sections];
    if (passageIndex !== null) {
      updatedSections[sectionIndex].passages[passageIndex].questions.push(newQuestion);
    } else {
      updatedSections[sectionIndex].questions.push(newQuestion);
    }
    setSections(updatedSections);
  };

  const handleQuestionChange = (sectionIndex, questionIndex, field, value, passageIndex = null) => {
    const updatedSections = [...sections];
    const targetQuestions = passageIndex !== null
      ? updatedSections[sectionIndex].passages[passageIndex].questions
      : updatedSections[sectionIndex].questions;

    targetQuestions[questionIndex] = {
      ...targetQuestions[questionIndex],
      [field]: value
    };

    setSections(updatedSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('testType', testType);
    formData.append('totalTime', totalTime.toString());
    formData.append('passingScore', passingScore.toString());

    const sectionsWithFileHandling = sections.map(section => ({
        ...section,
        questions: section.questions.map(question => ({
            ...question,
            audioFile: question.audioFile instanceof File ? question.audioFile : null,
            imageFile: question.imageFile instanceof File ? question.imageFile : null,
        }))
    }));

    formData.append('sections', JSON.stringify(sectionsWithFileHandling));

    sections.forEach((section, sectionIndex) => {
        section.questions.forEach((question, questionIndex) => {
            if (question.audioFile instanceof File) {
                formData.append(`sections[${sectionIndex}].questions[${questionIndex}].audioFile`, question.audioFile);
            }
            if (question.imageFile instanceof File) {
                formData.append(`sections[${sectionIndex}].questions[${questionIndex}].imageFile`, question.imageFile);
            }
        });
    });

    try {
        const response = await createEntranceTest(formData);
        if (response.data?.success) {
            toast.success('Entrance test created successfully!');
            // Reset form or redirect
        } else {
            toast.error('Failed to create entrance test');
        }
    } catch (error) {
        console.error('Error in handleSubmit:', error);
        toast.error('An error occurred while creating the entrance test');
    }
};

  const renderQuestionFields = (question, sectionIndex, questionIndex, passageIndex = null) => (
    <div className="space-y-4">
      <Select
        value={question.type}
        onValueChange={(value) => handleQuestionChange(sectionIndex, questionIndex, 'type', value, passageIndex)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select question type" />
        </SelectTrigger>
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

      <Textarea
        placeholder="Question text"
        value={question.text}
        onChange={(e) => handleQuestionChange(sectionIndex, questionIndex, 'text', e.target.value, passageIndex)}
        className="font-medium"
      />

      <AnswerInput
        question={question}
        sectionIndex={sectionIndex}
        questionIndex={questionIndex}
        handleQuestionChange={handleQuestionChange}
        passageIndex={passageIndex}
      />

      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor={`points-${sectionIndex}-${questionIndex}`} className="text-sm font-medium">Points</Label>
          <Input
            id={`points-${sectionIndex}-${questionIndex}`}
            type="number"
            placeholder="Points"
            value={question.points}
            onChange={(e) => handleQuestionChange(sectionIndex, questionIndex, 'points', parseInt(e.target.value), passageIndex)}
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor={`audio-${sectionIndex}-${questionIndex}`} className="text-sm font-medium">Audio File</Label>
          <Input
            id={`audio-${sectionIndex}-${questionIndex}`}
            type="file"
            accept="audio/*"
            onChange={(e) => {
              const file = e.target.files[0];
              handleQuestionChange(sectionIndex, questionIndex, 'audioFile', file, passageIndex);
            }}
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor={`image-${sectionIndex}-${questionIndex}`} className="text-sm font-medium">Image File</Label>
          <Input
            id={`image-${sectionIndex}-${questionIndex}`}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              handleQuestionChange(sectionIndex, questionIndex, 'imageFile', file, passageIndex);
            }}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Edit3 className="mr-2" /> Create Entrance Test
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-lg font-semibold">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter test title"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-lg font-semibold">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter test description"
            />
          </div>
          <div>
            <Label htmlFor="testType" className="text-lg font-semibold">Test Type</Label>
            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger id="testType">
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IELTS">IELTS</SelectItem>
                <SelectItem value="TOEIC">TOEIC</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="totalTime" className="text-lg font-semibold">Total Time (minutes)</Label>
            <Input
              id="totalTime"
              type="number"
              value={totalTime}
              onChange={(e) => setTotalTime(parseInt(e.target.value))}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="passingScore" className="text-lg font-semibold">Passing Score</Label>
            <Input
              id="passingScore"
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(parseInt(e.target.value))}
              required
              className="mt-1"
            />
          </div>

          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="mt-6">
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
                  <Textarea
                    placeholder={`${section.name} section description`}
                    value={section.description}
                    onChange={(e) => handleSectionChange(sectionIndex, 'description', e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor={`timeLimit-${sectionIndex}`} className="text-sm font-medium">Time Limit (minutes)</Label>
                    <Input
                      id={`timeLimit-${sectionIndex}`}
                      type="number"
                      value={section.timeLimit}
                      onChange={(e) => handleSectionChange(sectionIndex, 'timeLimit', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  {section.name === 'Reading' && (
                    <div className="space-y-4">
                      {section.passages.map((passage, passageIndex) => (
                        <Card key={passageIndex} className="mt-4">
                          <CardHeader>
                            <CardTitle>Passage {passageIndex + 1}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Textarea
                              placeholder="Passage text"
                              value={passage.text}
                              onChange={(e) => handlePassageChange(sectionIndex, passageIndex, e.target.value)}
                              className="mb-4"
                            />
                            {passage.questions.map((question, questionIndex) => (
                              <Card key={questionIndex} className="mb-4">
                                <CardHeader>
                                  <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  {renderQuestionFields(question, sectionIndex, questionIndex, passageIndex)}
                                </CardContent>
                              </Card>
                            ))}
                            <Button type="button" onClick={() => handleAddQuestion(sectionIndex, passageIndex)} className="mt-2">
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Question to Passage
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                      <Button type="button" onClick={() => handleAddPassage(sectionIndex)} className="mt-2">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Passage
                      </Button>
                    </div>
                  )}

                  {section.name !== 'Reading' && (
                    <div className="space-y-4">
                      {section.questions.map((question, questionIndex) => (
                        <Card key={questionIndex} className="mb-4">
                          <CardHeader>
                            <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {renderQuestionFields(question, sectionIndex, questionIndex)}
                          </CardContent>
                        </Card>
                      ))}
                      <Button type="button" onClick={() => handleAddQuestion(sectionIndex)} className="mt-2">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                      </Button>
                    </div>  
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="submit" className="mt-6 w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Entrance Test'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEntryTest;