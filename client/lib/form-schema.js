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

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  testType: z.enum(['IELTS', 'TOEIC', 'Custom']),
  totalTime: z.number().min(1, "Total time must be greater than 0"),
  sections: z.array(sectionSchema)
});



