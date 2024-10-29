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
  ], "Invalid question type"),
  text: z.string().min(1, "Question content is required").max(1000, "Question content cannot exceed 1000 characters"),
  points: z.number().min(0, "Points must be non-negative").max(100, "Points cannot exceed 100"),
  audioFile: z.any().optional().nullable(),
  imageFile: z.any().optional().nullable(),
  options: z.array(z.object({
    text: z.string().min(1, "Option text is required"),
    isCorrect: z.boolean()
  })).optional().default([]),
  correctAnswer: z.union([
    z.string(),
    z.boolean(),
    z.array(z.string())
  ]).optional(),
  orderItems: z.array(z.string()).optional().default([]),
  matchingPairs: z.array(z.object({
    left: z.string().min(1, "Left pair text is required"),
    right: z.string().min(1, "Right pair text is required")
  })).optional().default([])
});

export const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  description: z.string().max(500, "Description cannot exceed 500 characters"),
  testType: z.enum(['IELTS', 'TOEIC', 'Custom'], {
    errorMap: () => ({ message: "Invalid test type" }),
  }),
  totalTime: z.number().min(1, "Total time must be greater than 0").max(480, "Total time cannot exceed 8 hours"),
  sections: z.array(z.object({
    name: z.string().min(1, "Section name is required").max(50, "Section name cannot exceed 50 characters"),
    description: z.string().max(200, "Section description cannot exceed 200 characters"),
    timeLimit: z.number().min(1, "Time limit must be greater than 0").max(240, "Time limit cannot exceed 4 hours"),
    passages: z.array(z.object({
      text: z.string().min(1, "Passage content is required").max(5000, "Passage content cannot exceed 5000 characters"),
      audioFile: z.any().optional().nullable().refine(val => !val || val instanceof File, "Invalid audio file"),
      imageFile: z.any().optional().nullable().refine(val => !val || val instanceof File, "Invalid image file"),
      questions: z.array(questionSchema).optional().default([]),
    })).optional().default([]),
    questions: z.array(questionSchema).optional().default([]),
  })).min(1, "At least one section is required in the test"),
}).refine(
  data => data.sections.reduce((sum, section) => sum + section.timeLimit, 0) <= data.totalTime,
  "The total time of sections cannot exceed the test's total time"
);