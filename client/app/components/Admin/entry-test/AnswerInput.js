import React from 'react';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { PlusCircle, Trash2 } from 'lucide-react';

const AnswerInput = ({ question, sectionIndex, questionIndex, handleQuestionChange, passageIndex = null }) => {
  const updateOptions = (updatedOptions) => {
    handleQuestionChange(sectionIndex, questionIndex, 'options', updatedOptions, passageIndex);
  };

  const addOption = () => {
    const updatedOptions = [...(question.options || []), { text: '', isCorrect: false }];
    updateOptions(updatedOptions);
  };

  const updateOptionText = (index, text) => {
    const updatedOptions = [...question.options];
    updatedOptions[index].text = text;
    updateOptions(updatedOptions);
  };

  const updateOptionCorrectness = (index, isCorrect) => {
    const updatedOptions = [...question.options];
    updatedOptions[index].isCorrect = isCorrect;
    updateOptions(updatedOptions);
  };

  const renderMultipleChoiceOptions = () => (
    <div className="space-y-2">
      {question.options?.map((option, optionIndex) => (
        <div key={optionIndex} className="flex items-center space-x-2">
          <Checkbox
            checked={option.isCorrect}
            onCheckedChange={(checked) => updateOptionCorrectness(optionIndex, checked)}
          />
          <Input
            placeholder={`Option ${optionIndex + 1}`}
            value={option.text}
            onChange={(e) => updateOptionText(optionIndex, e.target.value)}
            className="flex-grow"
          />
          <Button 
            type="button" 
            variant="ghost"
            onClick={() => {
              const updatedOptions = question.options.filter((_, index) => index !== optionIndex);
              updateOptions(updatedOptions);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addOption} className="mt-2">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Option
      </Button>
    </div>
  );

  const renderTrueFalseOptions = () => (
    <RadioGroup
      value={question.correctAnswer?.toString()}
      onValueChange={(value) => handleQuestionChange(sectionIndex, questionIndex, 'correctAnswer', value === 'true', passageIndex)}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="true" id={`true-${sectionIndex}-${questionIndex}`} />
        <Label htmlFor={`true-${sectionIndex}-${questionIndex}`}>True</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="false" id={`false-${sectionIndex}-${questionIndex}`} />
        <Label htmlFor={`false-${sectionIndex}-${questionIndex}`}>False</Label>
      </div>
    </RadioGroup>
  );

  const renderShortAnswerInput = () => (
    <Input
      placeholder="Correct Answer"
      value={question.correctAnswer || ''}
      onChange={(e) => handleQuestionChange(sectionIndex, questionIndex, 'correctAnswer', e.target.value, passageIndex)}
    />
  );

  const renderMatchingPairs = () => (
    <div className="space-y-2">
      {question.matchingPairs?.map((pair, pairIndex) => (
        <div key={pairIndex} className="flex space-x-2">
          <Input
            placeholder="Left item"
            value={pair.left}
            onChange={(e) => {
              const updatedPairs = [...question.matchingPairs];
              updatedPairs[pairIndex].left = e.target.value;
              handleQuestionChange(sectionIndex, questionIndex, 'matchingPairs', updatedPairs, passageIndex);
            }}
          />
          <Input
            placeholder="Right item"
            value={pair.right}
            onChange={(e) => {
              const updatedPairs = [...question.matchingPairs];
              updatedPairs[pairIndex].right = e.target.value;
              handleQuestionChange(sectionIndex, questionIndex, 'matchingPairs', updatedPairs, passageIndex);
            }}
          />
          <Button 
            type="button" 
            variant="ghost"
            onClick={() => {
              const updatedPairs = question.matchingPairs.filter((_, index) => index !== pairIndex);
              handleQuestionChange(sectionIndex, questionIndex, 'matchingPairs', updatedPairs, passageIndex);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => {
        const updatedPairs = [...(question.matchingPairs || []), { left: '', right: '' }];
        handleQuestionChange(sectionIndex, questionIndex, 'matchingPairs', updatedPairs, passageIndex);
      }}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Matching Pair
      </Button>
    </div>
  );

  const renderOrderItems = () => (
    <div className="space-y-2">
      {question.orderItems?.map((item, itemIndex) => (
        <div key={itemIndex} className="flex items-center space-x-2">
          <Input
            placeholder={`Item ${itemIndex + 1}`}
            value={item}
            onChange={(e) => {
              const updatedItems = [...question.orderItems];
              updatedItems[itemIndex] = e.target.value;
              handleQuestionChange(sectionIndex, questionIndex, 'orderItems', updatedItems, passageIndex);
            }}
          />
          <Button 
            type="button" 
            variant="ghost"
            onClick={() => {
              const updatedItems = question.orderItems.filter((_, index) => index !== itemIndex);
              handleQuestionChange(sectionIndex, questionIndex, 'orderItems', updatedItems, passageIndex);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => {
        const updatedItems = [...(question.orderItems || []), ''];
        handleQuestionChange(sectionIndex, questionIndex, 'orderItems', updatedItems, passageIndex);
      }}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Order Item
      </Button>
    </div>
  );

  switch (question.type) {
    case 'multipleChoice':
      return renderMultipleChoiceOptions();
    case 'trueFalse':
      return renderTrueFalseOptions();
    case 'shortAnswer':
    case 'essay':
    case 'fillInTheBlank':
      return renderShortAnswerInput();
    case 'matching':
      return renderMatchingPairs();
    case 'ordering':
      return renderOrderItems();
    case 'selectFromDropdown':
      return renderMultipleChoiceOptions(); // Similar to multiple choice, but will be rendered differently in the test
    default:
      return null;
  }
};

export default AnswerInput;