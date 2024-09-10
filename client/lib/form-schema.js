import * as z from 'zod';

export const courseSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Course Name is required' }),
  description: z
    .string()
    .min(10, { message: 'Description is required' }),
price: z.coerce
  .number({ invalid_type_error: 'Price is required' })
  .min(0, { message: 'Price must be a non-negative number' }),
  estimatedPrice: z.coerce
    .number()
    .min(0, { message: 'Estimated Price must be a non-negative number' })
    .optional(),
  categories: z.string().min(1, { message: 'Please select a category' }),
  tags: z
    .string()
    .min(1, { message: 'At least one tag is required' }),
  level: z
    .string()
    .min(1, { message: 'Course Level is required' }),
  demoUrl: z
    .string({ message: 'Demo URL is required' })
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
  courseContentData: z.array(
    z.object({
      videoSection: z
        .string()
        .min(1, { message: 'Section name cannot be empty' })
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

