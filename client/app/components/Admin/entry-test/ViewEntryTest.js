import React from 'react';
import { useGetEntranceTestByIdQuery } from '@/app/redux/features/entry-test/entryTestApi';
import Loader from '../../Loader/Loader';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { Badge } from "../../ui/badge";
import { Headphones, BookOpen, Pen, Mic, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Progress } from "../../ui/progress";
import { Separator } from "../../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

const ViewEntryTest = ({ id }) => {
  const { data, isLoading } = useGetEntranceTestByIdQuery(id);

  const test = data?.test;

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
        <div className="mt-4 relative">
          <img
            src={imageUrl}
            alt="Test content"
            className="rounded-lg w-full object-cover"
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

  const renderQuestionContent = (question) => {
    const baseContent = (
      <>
        {question.imageFile && renderImage(question.imageFile)}
        {renderDefaultQuestionContent(question)}
        {renderAnswer(question)}
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
          <RadioGroup>
            {question.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={`option-${idx}`} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'trueFalse':
        return (
          <RadioGroup>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false">False</Label>
            </div>
          </RadioGroup>
        );
      case 'shortAnswer':
        return <Input placeholder="Type your answer here" className="mt-2" />;
      case 'essay':
        return <Textarea placeholder="Write your essay here" className="mt-2 h-32" />;
      case 'fillInTheBlank':
        return <Input placeholder="Fill in the blank" className="mt-2" />;
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
          <Select>
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
                  <Input placeholder={`Match for item ${idx + 1}`} />
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderAnswer = (question) => {
    let answerContent = null;

    switch (question.type) {
      case 'multipleChoice':
        const correctOption = question.options?.find(option => option.isCorrect);
        answerContent = correctOption ? correctOption.text : 'No correct answer provided';
        break;
      case 'trueFalse':
        answerContent = question.correctAnswer ? 'True' : 'False';
        break;
      case 'ordering':
        if (question.orderItems && question.correctAnswer) {
          const orderedItems = question.orderItems.map((item, index) => ({
            item,
            correctPosition: question.correctAnswer[index]
          }));
          orderedItems.sort((a, b) => a.correctPosition - b.correctPosition);
          answerContent = orderedItems.map(obj => obj.item).join(' → ');
        } else {
          answerContent = 'No correct answer provided';
        }
        break;
      case 'selectFromDropdown':
        answerContent = question.correctAnswer;
        break;
      case 'shortAnswer':
      case 'essay':
      case 'fillInTheBlank':
        answerContent = question.correctAnswer;
        break;
      case 'matching':
        answerContent = question.matchingPairs?.map(pair => `${pair.left} - ${pair.right}`).join(', ');
        break;
      default:
        answerContent = 'Answer format not recognized';
    }

    return (
      <div className="mt-4 p-4 bg-green-100 rounded-md">
        <h5 className="font-semibold text-green-800">Correct Answer:</h5>
        <p className="text-green-700">{answerContent}</p>
      </div>
    );
  };

  const renderPassageContent = (passage, questions) => (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="prose max-w-none">
          {passage.text}
        </div>
        {passage.audioFile && (
          <div className="mt-4 flex items-center space-x-2">
            <Headphones className="h-4 w-4" />
            <audio controls className="w-full">
              <source src={passage.audioFile} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <Progress value={0} className="w-full mt-2 hidden audio-loading" />
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

  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="container mx-auto p-4 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">{test.title}</h1>
                  <p className="text-muted-foreground mt-2">{test.description}</p>
                </div>
                <Badge variant="outline" className="text-lg">
                  <Clock className="mr-2 h-4 w-4" />
                  {test.totalTime} minutes
                </Badge>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Test Information</AlertTitle>
                <AlertDescription>
                  This is a {test.testType} format test. Please make sure you have {test.totalTime} minutes available before starting.
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
            </div>
          </>
        )
      }
    </>
  );
};

export default ViewEntryTest;