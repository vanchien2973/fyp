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

