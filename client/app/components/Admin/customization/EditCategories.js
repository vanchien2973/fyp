import { useEditLayoutMutation, useGetHeroDataQuery } from '@/app/redux/features/layout/layoutApi';
import React, { useEffect, useState } from 'react'
import Loader from '../../Loader/Loader';
import { Trash, Plus, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import toast from 'react-hot-toast';

const EditCategories = () => {
    const { data, refetch, isLoading } = useGetHeroDataQuery("Categories", {
        refetchOnMountOrArgChange: true,
    });
    const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
    const [categories, setCategories] = useState([]);

    const generateUniqueId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    useEffect(() => {
        if (data) {
            const categoriesWithIds = data.layout.categories.map(cat => ({
                ...cat,
                _id: cat._id || generateUniqueId()
            }));
            setCategories(categoriesWithIds);
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

    const handleAddLevel = (categoryId, value) => {
        setCategories((prevCategories) =>
            prevCategories.map((category) =>
                category._id === categoryId
                    ? { ...category, levels: [...(category.levels || []), value] }
                    : category
            )
        );
    };

    const handleRemoveLevel = (categoryId, levelIndex) => {
        setCategories((prevCategories) =>
            prevCategories.map((category) =>
                category._id === categoryId
                    ? { ...category, levels: category.levels.filter((_, index) => index !== levelIndex) }
                    : category
            )
        );
    };

    const handleNewCategories = () => {
        if (categories[categories.length - 1]?.title === '') {
            toast.error('Please fill the category name');
        } else {
            setCategories((prevCategory) => [
                ...prevCategory, 
                { 
                    _id: generateUniqueId(),
                    title: '', 
                    levels: [] 
                }
            ]);
        }
    };

    const areCategoriesUnchanged = (originalCategories, newCategories) => {
        return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
    };

    const isAnyCategoriesEmpty = (categories) => {
        return categories.some((category) => category.title === '' || category.levels.length === 0);
    };

    const handleEdit = async () => {
        const originalCategories = data?.layout?.categories;
        if (!areCategoriesUnchanged(originalCategories, categories) && !isAnyCategoriesEmpty(categories)) {
            const categoriesToSend = categories.map(({ _id, ...rest }) => rest);
            await editLayout({
                type: 'Categories',
                categories: categoriesToSend
            }).unwrap();
        }
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">Categories</h2>
                    {categories && categories.map((category, index) => (
                        <div key={category._id} className="border border-gray-300 rounded-md p-4 mb-4 space-y-4">
                            <div className='flex items-center w-full justify-between'>
                                <Input
                                    value={category.title}
                                    onChange={(e) => handleAddCategories(category._id, e.target.value)}
                                    placeholder="Enter your category"
                                    className="flex-2 w-[90%]"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCategories((prevCategory) => prevCategory.filter((i) => i._id !== category._id))}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="mt-2">
                                <h4 className="text-sm font-semibold mb-2">Levels:</h4>
                                {category.levels && category.levels.map((level, levelIndex) => (
                                    <div key={levelIndex} className="flex items-center mb-2">
                                        <Input
                                            value={level}
                                            onChange={(e) => {
                                                const newLevels = [...category.levels];
                                                newLevels[levelIndex] = e.target.value;
                                                setCategories((prevCategories) =>
                                                    prevCategories.map((c) =>
                                                        c._id === category._id ? { ...c, levels: newLevels } : c
                                                    )
                                                );
                                            }}
                                            placeholder="Enter level"
                                            className="flex-1 mr-2"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleRemoveLevel(category._id, levelIndex)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    onClick={() => handleAddLevel(category._id, '')}
                                    className="mt-2"
                                    size="sm"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Level
                                </Button>
                            </div>
                        </div>
                    ))}
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
                            className={`rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 ${
                                areCategoriesUnchanged(data?.layout?.categories, categories) || isAnyCategoriesEmpty(categories)
                                    ? 'cursor-not-allowed'
                                    : 'cursor-pointer'
                            }`}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default EditCategories;