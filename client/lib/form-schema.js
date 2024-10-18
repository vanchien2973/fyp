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


// Option Schema
const optionSchema = z.object({
  text: z.string(),
  isCorrect: z.boolean()
});

// Matching Pair Schema
const matchingPairSchema = z.object({
  left: z.string(),
  right: z.string()
});

// Question Schema
const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
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
  options: z.array(optionSchema).optional(),
  matchingPairs: z.array(matchingPairSchema).optional(),
  orderItems: z.array(z.string()).optional(),
  correctAnswer: z.any().optional(),
  points: z.number().default(1),
  audioFile: z.string().nullable().default(null),
  imageFile: z.string().nullable().default(null)
}).refine(data => {
  switch (data.type) {
    case 'multipleChoice':
      return data.options && data.options.length > 0;
    case 'matching':
      return data.matchingPairs && data.matchingPairs.length > 0;
    case 'ordering':
      return data.orderItems && data.orderItems.length > 0;
    default:
      return true;
  }
}, {
  message: "Question must have appropriate data based on its type"
});

// Passage Schema
const passageSchema = z.object({
  text: z.string().min(1, "Passage text is required"),
  audioFile: z.string().nullable().default(null),
  imageFile: z.string().nullable().default(null),
  questions: z.array(questionSchema)
});

// Section Schema
const sectionSchema = z.object({
  name: z.string(),
  description: z.string(),
  timeLimit: z.number().int().positive(),
  passages: z.array(passageSchema),
  questions: z.array(questionSchema)
}).refine(data => {
  return data.passages.length > 0 || data.questions.length > 0;
}, {
  message: "Section must have at least one passage or question"
});

// Main Entrance Test Schema
const entranceTestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  testType: z.enum(['IELTS', 'TOEIC', 'Custom']),
  sections: z.array(sectionSchema).min(1, "Test must have at least one section"),
  totalTime: z.number().int().positive(),
  createdAt: z.date().default(() => new Date())
});


