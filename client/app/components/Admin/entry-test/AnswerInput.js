import React, { useEffect } from 'react';
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
  form,
  isEditing = false
}) => {
  const getFieldName = (field) => {
    return passageIndex !== null
      ? `sections.${sectionIndex}.passages.${passageIndex}.questions.${questionIndex}.${field}`
      : `sections.${sectionIndex}.questions.${questionIndex}.${field}`;
  };

  // Initialize question data when editing
  useEffect(() => {
    if (isEditing && question) {
      // Set form values for the question
      const fieldNames = ['options', 'correctAnswer', 'matchingPairs', 'orderItems'];
      fieldNames.forEach(fieldName => {
        if (question[fieldName]) {
          form.setValue(getFieldName(fieldName), question[fieldName]);
        }
      });
    }
  }, [isEditing, question, form]);

  const updateOptions = (updatedOptions) => {
    const fieldName = getFieldName('options');
    form.setValue(fieldName, updatedOptions);
    handleQuestionChange(sectionIndex, questionIndex, 'options', updatedOptions, passageIndex);
  };

  const updateCorrectAnswer = (value) => {
    const fieldName = getFieldName('correctAnswer');
    form.setValue(fieldName, value);
    handleQuestionChange(sectionIndex, questionIndex, 'correctAnswer', value, passageIndex);
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
              <FormItem className="flex-grow">
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <RadioGroup
                      value={
                        question.options.findIndex(opt => opt.isCorrect)?.toString() || ''
                      }
                      onValueChange={(value) => {
                        const updatedOptions = question.options.map((opt, idx) => ({
                          ...opt,
                          isCorrect: idx === parseInt(value)
                        }));
                        updateOptions(updatedOptions);
                        
                        if (question.type === 'selectFromDropdown') {
                          updateCorrectAnswer(updatedOptions[parseInt(value)].text);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2 w-full">
                        <RadioGroupItem 
                          value={optionIndex.toString()} 
                          id={`${question._id}-option-${optionIndex}`}
                        />
                        <Input
                          value={option.text || ''}
                          placeholder={`Option ${optionIndex + 1}`}
                          onChange={(e) => {
                            const updatedOptions = [...question.options];
                            updatedOptions[optionIndex] = {
                              ...updatedOptions[optionIndex],
                              text: e.target.value
                            };
                            updateOptions(updatedOptions);
                            
                            if (question.type === 'selectFromDropdown' && option.isCorrect) {
                              updateCorrectAnswer(e.target.value);
                            }
                          }}
                          className="flex-grow"
                        />
                      </div>
                    </RadioGroup>
                  </div>
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
          <FormLabel>Correct Answer</FormLabel>
          <FormControl>
            <RadioGroup
              value={(isEditing ? question.correctAnswer : field.value)?.toString()}
              onValueChange={(value) => {
                const boolValue = value === 'true';
                field.onChange(boolValue);
                updateCorrectAnswer(boolValue);
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

  const renderMatchingPairs = () => (
    <div className="space-y-2">
      {(question.matchingPairs || []).map((pair, pairIndex) => (
        <div key={pairIndex} className="grid grid-cols-[1fr,1fr,auto] gap-2">
          <FormField
            control={form.control}
            name={`${getFieldName('matchingPairs')}.${pairIndex}.left`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Left item"
                    onChange={(e) => {
                      field.onChange(e);
                      const updatedPairs = [...question.matchingPairs];
                      updatedPairs[pairIndex].left = e.target.value;
                      form.setValue(getFieldName('matchingPairs'), updatedPairs);
                      handleQuestionChange(sectionIndex, questionIndex, 'matchingPairs', updatedPairs, passageIndex);
                      updateCorrectAnswer(JSON.stringify(updatedPairs));
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${getFieldName('matchingPairs')}.${pairIndex}.right`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Right item"
                    onChange={(e) => {
                      field.onChange(e);
                      const updatedPairs = [...question.matchingPairs];
                      updatedPairs[pairIndex].right = e.target.value;
                      form.setValue(getFieldName('matchingPairs'), updatedPairs);
                      handleQuestionChange(sectionIndex, questionIndex, 'matchingPairs', updatedPairs, passageIndex);
                      // Update correctAnswer to include all pairs
                      updateCorrectAnswer(JSON.stringify(updatedPairs));
                    }}
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
              // Update correctAnswer to reflect removed pair
              updateCorrectAnswer(JSON.stringify(updatedPairs));
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const currentPairs = form.getValues(getFieldName('matchingPairs')) || [];
          const updatedPairs = [...currentPairs, { left: '', right: '' }];
          form.setValue(getFieldName('matchingPairs'), updatedPairs);
          handleQuestionChange(sectionIndex, questionIndex, 'matchingPairs', updatedPairs, passageIndex);
          // Update correctAnswer to include new pair
          updateCorrectAnswer(JSON.stringify(updatedPairs));
        }}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Matching Pair
      </Button>
    </div>
  );

  const renderOrderItems = () => (
    <div className="space-y-2">
      {(question.orderItems || []).map((item, itemIndex) => (
        <div key={itemIndex} className="flex items-center space-x-2">
          <span className="w-8 text-center">{itemIndex + 1}</span>
          <FormField
            control={form.control}
            name={`${getFieldName('orderItems')}.${itemIndex}`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`Item ${itemIndex + 1}`}
                    onChange={(e) => {
                      field.onChange(e);
                      const updatedItems = [...question.orderItems];
                      updatedItems[itemIndex] = e.target.value;
                      form.setValue(getFieldName('orderItems'), updatedItems);
                      handleQuestionChange(sectionIndex, questionIndex, 'orderItems', updatedItems, passageIndex);
                      // Update correctAnswer to match the order
                      updateCorrectAnswer(JSON.stringify(updatedItems));
                    }}
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
              // Update correctAnswer to match the new order
              updateCorrectAnswer(JSON.stringify(updatedItems));
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
        // Update correctAnswer to match the new order
        updateCorrectAnswer(JSON.stringify(updatedItems));
      }}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Order Item
      </Button>
    </div>
  );

 const renderTextAnswer = () => (
    <FormField
      control={form.control}
      name={getFieldName('correctAnswer')}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Correct Answer</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={isEditing ? question.correctAnswer : field.value}
              placeholder="Enter correct answer"
              onChange={(e) => {
                field.onChange(e);
                updateCorrectAnswer(e.target.value);
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
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
      return renderTextAnswer();
    case 'matching':
      return renderMatchingPairs();
    case 'ordering':
      return renderOrderItems();
    default:
      return <p>Please select a question type</p>;
  }
};

export default AnswerInput;