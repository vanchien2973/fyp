import * as z from 'zod';

export const courseSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Course Name is required' }),
  description: z
    .string()
    .min(10, { message: 'Description is required' }),
  rank: z.enum(['Beginner', 'Intermediate Level', 'Advanced Level'], {
    required_error: 'Rank is required',
  }),
  category: z.object({
    title: z.string().min(1, { message: 'Category is required' }),
    level: z.string().min(1, { message: 'Level is required' })
  }).refine((category) => !!category.title && !!category.level, {
    message: 'Both category and level must be selected',
    path: ['category'],
  }),
  price: z.coerce
    .number({ invalid_type_error: 'Price is required' })
    .min(0, { message: 'Price must be a non-negative number' }),
  estimatedPrice: z.coerce
    .number()
    .min(0, { message: 'Estimated Price must be a non-negative number' })
    .optional(),
  tags: z
    .string()
    .min(1, { message: 'At least one tag is required' }),
  demoUrl: z
    .string({ message: 'Demo URL is required' })
    .optional(),
});

export const benfits_prerequisitesSchema = z.object({
  benefits: z.array(z.object({ title: z.string().min(1, "Benefit is required") })).min(1, "At least one benefit is required"),
  prerequisites: z.array(z.object({ title: z.string().min(1, "Prerequisite is required") })).min(1, "At least one prerequisite is required"),
});

export const courseContentSchema = z.object({
  courseContentData: z.array(
    z.object({
      videoSection: z
        .string()
        .default('Untitled Section'),
      content: z.array(
        z.object({
          videoUrl: z
            .string()
            .min(1, { message: 'Video URL cannot be empty' }),
          videoLength: z.coerce
            .number()
            .min(0, { message: 'Video Lenth be a non-negative number' }),
          title: z
            .string()
            .min(1, { message: 'Title is required' }),
          description: z
            .string()
            .min(5, { message: 'Description is required' }),
          links: z.array(
            z.object({
              title: z.string().nonempty({ message: "Link title is required" }),
              url: z.string().nonempty({ message: "Link URL is required" }).url({ message: "Must be a valid URL" })
            })
          )
        })
      )
    })
  )
});

// File validation schema
const fileSchema = z.instanceof(File).nullable().optional();

// Base question fields that all question types share
const baseQuestionSchema = z.object({
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
  points: z.number().min(0, "Points must be non-negative"),
  audioFile: fileSchema,
  imageFile: fileSchema,
  timeLimit: z.number().min(0, "Time limit must be non-negative")
});

// Multiple choice and select from dropdown questions
const multipleChoiceQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(['multipleChoice', 'selectFromDropdown']),
  options: z.array(z.object({
    text: z.string().min(1, "Option text is required"),
    isCorrect: z.boolean()
  }))
    .min(2, "At least 2 options are required")
    .refine(
      options => options.some(option => option.isCorrect),
      "At least one option must be marked as correct"
    )
});

// True/False questions
const trueFalseQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('trueFalse'),
  correctAnswer: z.boolean()
});

// Short answer, essay, and fill in the blank questions
const textAnswerQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(['shortAnswer', 'essay', 'fillInTheBlank']),
  correctAnswer: z.string().min(1, "Correct answer is required")
});

// Matching questions
const matchingQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('matching'),
  matchingPairs: z.array(z.object({
    left: z.string().min(1, "Left item is required"),
    right: z.string().min(1, "Right item is required")
  }))
    .min(2, "At least 2 matching pairs are required")
});

// Ordering questions
const orderingQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('ordering'),
  orderItems: z.array(z.string().min(1, "Order item is required"))
    .min(2, "At least 2 order items are required")
});

// Combine all question types
const questionSchema = z.discriminatedUnion('type', [
  multipleChoiceQuestionSchema,
  trueFalseQuestionSchema,
  textAnswerQuestionSchema,
  matchingQuestionSchema,
  orderingQuestionSchema
]);

// Passage schema
const passageSchema = z.object({
  text: z.string().min(1, "Passage text is required"),
  questions: z.array(questionSchema),
  audioFile: fileSchema,
  imageFile: fileSchema
});

// Section schema
const sectionSchema = z.object({
  name: z.enum(['Listening', 'Reading', 'Writing', 'Speaking']),
  description: z.string(),
  timeLimit: z.number().min(1, "Time limit must be at least 1 minute"),
  passages: z.array(passageSchema).optional(),
  questions: z.array(questionSchema)
}).refine(
  data => {
    if (['Listening', 'Reading'].includes(data.name)) {
      return data.passages && data.passages.length > 0;
    }
    return true;
  },
  {
    message: "Listening and Reading sections must have at least one passage",
    path: ['passages']
  }
);

// Main entrance test schema
export const entranceTestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  testType: z.enum(['IELTS', 'TOEIC', 'Custom']),
  totalTime: z.number().min(1, "Total time must be at least 1 minute"),
  sections: z.array(sectionSchema)
    .min(1, "At least one section is required")
    .refine(
      sections => {
        const totalSectionTime = sections.reduce((sum, section) => sum + section.timeLimit, 0);
        return totalSectionTime <= sections[0].totalTime;
      },
      "Total section time cannot exceed test total time"
    )
});


