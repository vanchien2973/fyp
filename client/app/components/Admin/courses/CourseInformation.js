'use client';
import React, { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { courseSchema } from '@/lib/form-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Image } from '../../ui/image';
import toast from 'react-hot-toast';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useGetHeroDataQuery } from '@/app/redux/features/layout/layoutApi';

const CourseInformation = ({ courseInfor, setCourseInfor, setCurrentStep, currentStep }) => {
  const [dragging, setDragging] = useState(false);
  const { data } = useGetHeroDataQuery("Categories", {});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: courseInfor,
    mode: 'onChange'
  });

  useEffect(() => {
    form.reset(courseInfor);
  }, [courseInfor, form]);

  const handleChangeFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.readyState === 2) {
          setCourseInfor({ ...courseInfor, thumbnail: reader.result });
          form.setValue('thumbnail', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCourseInfor({ ...courseInfor, thumbnail: reader.result });
        form.setValue('thumbnail', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const next = async (e) => {
    e.preventDefault();
    const isValid = await form.trigger();
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <>
      <Form {...form}>
        <form className="w-full space-y-8" onSubmit={form.handleSubmit(next)}>
          <div className="relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={courseInfor.name}
                      onChange={(e) => {
                        field.onChange(e);
                        setCourseInfor({ ...courseInfor, name: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-1'>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={courseInfor.description}
                      onChange={(e) => {
                        field.onChange(e);
                        setCourseInfor({ ...courseInfor, description: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={courseInfor.price}
                      onChange={(e) => {
                        field.onChange(e);
                        setCourseInfor({ ...courseInfor, price: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimatedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Price (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={courseInfor.estimatedPrice}
                      onChange={(e) => {
                        field.onChange(e);
                        setCourseInfor({ ...courseInfor, estimatedPrice: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-2">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Level</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={courseInfor.level}
                      onChange={(e) => {
                        field.onChange(e);
                        setCourseInfor({ ...courseInfor, level: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="demoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demo Url</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={courseInfor.demoUrl}
                      onChange={(e) => {
                        field.onChange(e);
                        setCourseInfor({ ...courseInfor, demoUrl: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-2">
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Category</FormLabel>
                  <FormControl>
                    <Select
                      value={courseInfor.categories}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setCourseInfor((prev) => ({ ...prev, categories: value }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your category"/>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.title} value={category.title}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Tags</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={courseInfor.tags}
                      onChange={(e) => {
                        field.onChange(e);
                        setCourseInfor({ ...courseInfor, tags: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-1">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Thumbnail</FormLabel>
                  <FormControl>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-4 ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDragDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        id="file"
                        className="hidden"
                        onChange={handleChangeFile}
                      />
                      <label htmlFor="file" className="cursor-pointer block text-center">
                        {courseInfor.thumbnail ? (
                          <Image
                            src={courseInfor.thumbnail}
                            alt="Thumbnail Preview"
                            className="max-h-70 w-auto mx-auto object-cover"
                          />
                        ) : (
                          <span>Drag and drop your thumbnail here or click to browse</span>
                        )}
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
        </form>
      </Form>
      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={next}
            disabled={currentStep === 1}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CourseInformation;