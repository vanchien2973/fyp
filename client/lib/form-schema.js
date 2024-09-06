import * as z from 'zod';

export const courseSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Course Name must be at least 3 characters' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
  price: z.coerce
    .number()
    .min(0, { message: 'Price must be a non-negative number' }),
  estimatedPrice: z.coerce
    .number()
    .min(0, { message: 'Estimated Price must be a non-negative number' })
    .optional(),
  tags: z
    .string()
    .min(1, { message: 'At least one tag is required' }),
  level: z
    .string()
    .min(1, { message: 'Please select a course level' }),
  demoUrl: z
    .string({ message: 'Demo URL must be a valid URL' })
    .optional(),
});

export const benfits_prerequisitesSchema = z.object({
  benefits: z
    .array(
      z.object({
        title: z.string().min(1, { message: 'Benefit cannot be empty' })
      })
    )
    .min(1, { message: 'At least one benefit is required' }),
  prerequisites: z
    .array(
      z.object({
        title: z.string().min(1, { message: 'Prerequisite cannot be empty' })
      })
    )
    .min(1, { message: 'At least one prerequisite is required' })
});

export const courseContentSchema = z.object({
  courseContentData: z.array(z.object({
    videoUrl: z
      .string()
      .min(1, { message: 'Video URL cannot be empty' }),
    title: z
      .string()
      .min(1, { message: 'Title is required' }),
    videoSection: z
    .string()
    .optional()
    .default('Untitled Section'),
    description: z
      .string()
      .min(5, { message: 'Description must be at least 5 characters' }),
    links: z.array(z.object({
      title: z.string().nonempty({ message: "Link title is required" }),
      url: z.string().nonempty({ message: "Link URL is required" }).url({ message: "Must be a valid URL" })
    }))
  }))
});
