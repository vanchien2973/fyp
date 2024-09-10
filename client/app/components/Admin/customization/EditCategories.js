import { useEditLayoutMutation, useGetHeroDataQuery } from '@/app/redux/features/layout/layoutApi';
import React, { useEffect, useState } from 'react'
import Loader from '../../Loader/Loader';
import { Trash } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import toast from 'react-hot-toast';

const EditCategories = () => {
    const { data, refetch, isLoading } = useGetHeroDataQuery("Categories", {
        refetchOnMountOrArgChange: true,
    });
    const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (data) {
            setCategories(data.layout.categories);
        }
        if (isSuccess) {
            toast.success('Categories updated successfully');
            refetch();
        }
        if (error && error.data) {
            toast.error(error.data.message);
        }
    }, [data, isSuccess, error]);

    const handleAddCategories = (id, value) => {
        setCategories((prevCategory) =>
            prevCategory.map((category) => (category._id === id ? { ...category, title: value } : category)))
    };

    const handleNewCategories = () => {
        if (categories[categories.length - 1].title === '') {
            toast.error('Please fill the category name');
        } else {
            setCategories((prevCategory) => [...prevCategory, { title: '' }]);
        }
    };

    const areCategoriesUnchanged = (originalCategories, newCategories) => {
        return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
    };

    const isAnyCategoriesEmpty = (categories) => {
        return categories.some((category) => category.title === '');
    };

    const handleEdit = async () => {
        const originalCategories = data?.layout?.categories;
        if (!areCategoriesUnchanged(originalCategories, categories) && !isAnyCategoriesEmpty(categories)) {
            await editLayout({
                type: 'Categories',
                categories: categories
            }).unwrap();
        }
    } ;

    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">Categories</h2>
                            {categories && categories.map((category, index) => {
                                return (
                                    <>
                                        <div className="border border-gray-300 rounded-md p-4 mb-4 space-y-4">
                                            <div className='flex items-center w-full justify-between'>
                                                <Input
                                                    value={category.title}
                                                    onChange={(e) => {
                                                        handleAddCategories(category._id, e.target.value)
                                                    }}
                                                    placeholder="Enter your category"
                                                    className="flex-2 w-[90%]"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        setCategories((prevCategory) =>
                                                            prevCategory.filter((i) => i._id !== category._id)
                                                        )
                                                    }
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                            <Button
                                onClick={handleNewCategories}
                                className="w-full mt-4"
                            >
                                Add New Category
                            </Button>
                            <div className="mt-8 flex justify-end">
                            <Button
                                type="button"
                                onClick={
                                    areCategoriesUnchanged(data?.layout?.categories, categories) || isAnyCategoriesEmpty(categories)
                                    ? () => null
                                    : handleEdit
                            }
                                className={`rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 ${areCategoriesUnchanged(data?.layout?.categories, categories) || isAnyCategoriesEmpty(categories)
                                    ? 'cursor-not-allowed'
                                    : 'cursor-pointer'
                                }`}
                            >
                                Save Changes
                            </Button>
                        </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default EditCategories;
