import React from 'react';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { PlusCircle, Trash2 } from 'lucide-react';
import { FormField, FormItem, FormControl, FormLabel } from "../../ui/form";

const AnswerInput = ({ 
  question, 
  sectionIndex, 
  questionIndex, 
  handleQuestionChange, 
  passageIndex = null,
  form
}) => {
  const getFieldName = (field) => {
    return passageIndex !== null
      ? `sections.${sectionIndex}.passages.${passageIndex}.questions.${questionIndex}.${field}`
      : `sections.${sectionIndex}.questions.${questionIndex}.${field}`;
  };

  const updateOptions = (updatedOptions) => {
    const fieldName = getFieldName('options');
    form.setValue(fieldName, updatedOptions);
    handleQuestionChange(sectionIndex, questionIndex, 'options', updatedOptions, passageIndex);
  };

  const addOption = () => {
    const currentOptions = form.getValues(getFieldName('options')) || [];
    const updatedOptions = [...currentOptions, { text: '', isCorrect: false }];
    updateOptions(updatedOptions);
  };

  const renderMultipleChoiceOptions = () => (
    <div className="space-y-2">
      {(question.options || []).map((option, optionIndex) => (
        <div key={optionIndex} className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name={`${getFieldName('options')}.${optionIndex}.isCorrect`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${getFieldName('options')}.${optionIndex}.text`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                </FormControl>
              </FormItem>
            )}
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
    <FormField
      control={form.control}
      name={getFieldName('correctAnswer')}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              value={field.value?.toString()}
              onValueChange={(value) => {
                field.onChange(value === 'true');
                handleQuestionChange(sectionIndex, questionIndex, 'correctAnswer', value === 'true', passageIndex);
              }}
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
          </FormControl>
        </FormItem>
      )}
    />
  );

  const renderShortAnswerInput = () => (
    <FormField
      control={form.control}
      name={getFieldName('correctAnswer')}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              {...field}
              placeholder="Correct Answer"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );

  const renderMatchingPairs = () => (
    <div className="space-y-2">
      {(question.matchingPairs || []).map((pair, pairIndex) => (
        <div key={pairIndex} className="flex space-x-2">
          <FormField
            control={form.control}
            name={`${getFieldName('matchingPairs')}.${pairIndex}.left`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Left item"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${getFieldName('matchingPairs')}.${pairIndex}.right`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Right item"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button 
            type="button" 
            variant="ghost"
            onClick={() => {
              const updatedPairs = question.matchingPairs.filter((_, index) => index !== pairIndex);
              form.setValue(getFieldName('matchingPairs'), updatedPairs);
              handleQuestionChange(sectionIndex, questionIndex, 'matchingPairs', updatedPairs, passageIndex);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => {
        const currentPairs = form.getValues(getFieldName('matchingPairs')) || [];
        const updatedPairs = [...currentPairs, { left: '', right: '' }];
        form.setValue(getFieldName('matchingPairs'), updatedPairs);
        handleQuestionChange(sectionIndex, questionIndex, 'matchingPairs', updatedPairs, passageIndex);
      }}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Matching Pair
      </Button>
    </div>
  );

  const renderOrderItems = () => (
    <div className="space-y-2">
      {(question.orderItems || []).map((item, itemIndex) => (
        <div key={itemIndex} className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name={`${getFieldName('orderItems')}.${itemIndex}`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`Item ${itemIndex + 1}`}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button 
            type="button" 
            variant="ghost"
            onClick={() => {
              const updatedItems = question.orderItems.filter((_, index) => index !== itemIndex);
              form.setValue(getFieldName('orderItems'), updatedItems);
              handleQuestionChange(sectionIndex, questionIndex, 'orderItems', updatedItems, passageIndex);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => {
        const currentItems = form.getValues(getFieldName('orderItems')) || [];
        const updatedItems = [...currentItems, ''];
        form.setValue(getFieldName('orderItems'), updatedItems);
        handleQuestionChange(sectionIndex, questionIndex, 'orderItems', updatedItems, passageIndex);
      }}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Order Item
      </Button>
    </div>
  );

  switch (question.type) {
    case 'multipleChoice':
    case 'selectFromDropdown':
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
    default:
      return null;
  }
};

export default AnswerInput;