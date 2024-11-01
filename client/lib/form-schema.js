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

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean()
});

const matchingPairSchema = z.object({
  left: z.string().min(1, "Left item is required"),
  right: z.string().min(1, "Right item is required")
});

const questionSchema = z.object({
  text: z.string().min(1, "Question content is required"),
  type: z.enum([
    'multipleChoice',
    'trueFalse',
    'shortAnswer', 
    'essay',
    'fillInTheBlank',
    'matching',
    'ordering',
    'selectFromDropdown'
  ], {
    required_error: "Question type is required"
  }),
  options: z.union([
    z.array(optionSchema),
    z.array(z.string()),
    z.null()
  ]).optional(),
  matchingPairs: z.union([
    z.array(matchingPairSchema),
    z.null()
  ]).optional(),
  orderItems: z.union([
    z.array(z.string()),
    z.null()
  ]).optional(),
  correctAnswer: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
    z.array(z.number()),
    z.null()
  ]).optional(),
  points: z.union([
    z.string(), 
    z.number()
  ]).transform(val => Number(val)).default(1),
  audioFile: z.any().optional(),
  imageFile: z.any().optional(),
}).passthrough().refine((data) => {
  switch (data.type) {
    case 'multipleChoice':
    case 'selectFromDropdown':
      return Array.isArray(data.options) && data.options.length > 0;
    case 'trueFalse':
      return typeof data.correctAnswer === 'boolean' || data.correctAnswer === null;
    case 'matching':
      return Array.isArray(data.matchingPairs) && data.matchingPairs.length > 0;
    case 'ordering':
      return Array.isArray(data.orderItems) && data.orderItems.length > 0;
    case 'shortAnswer':
    case 'essay':
    case 'fillInTheBlank':
      return true;
    default:
      return true;
  }
}, {
  message: "Invalid question format for the selected type"
});

const passageSchema = z.object({
  text: z.string().min(1, "Passage text is required"),
  audioFile: z.any().optional(),
  imageFile: z.any().optional(),
  questions: z.array(questionSchema).nullable().optional(),
}).passthrough();

const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  description: z.string().optional(),
  timeLimit: z.union([z.string(), z.number()]).transform(val => Number(val)),
  passages: z.array(passageSchema).nullable().optional(),
  questions: z.array(questionSchema).nullable().optional(),
}).passthrough();

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  testType: z.string().min(1, "Test type is required"),
  sections: z.array(sectionSchema),
  totalTime: z.union([z.string(), z.number()]).transform(val => Number(val)),
  createdAt: z.any().optional(),
}).passthrough();