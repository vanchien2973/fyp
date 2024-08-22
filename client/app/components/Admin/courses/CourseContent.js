"use client";
import { PencilIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { DeleteOutline, KeyboardArrowDown, LinkOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CourseContent = ({
    active,
    setActive,
    courseContentData,
    setCourseContentData,
    handleSubmit: handleCourseSubmit,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(
        Array(courseContentData.length).fill(false)
    );
    const [activeSection, setActiveSection] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleCollapseToggle = (index) => {
        const newIsCollapsed = [...isCollapsed];
        newIsCollapsed[index] = !newIsCollapsed[index];
        setIsCollapsed(newIsCollapsed);
    };

    const handleRemoveLink = (index, linkIndex) => {
        const newCourseContentData = [...courseContentData];
        newCourseContentData[index].links.splice(linkIndex, 1);
        setCourseContentData(newCourseContentData);
    };

    const handleAddLink = (index) => {
        const newCourseContentData = [...courseContentData];
        newCourseContentData[index].links.push({ title: '', url: '' });
        setCourseContentData(newCourseContentData);
    };

    const handleNewContent = () => {
        const lastContent = courseContentData[courseContentData.length - 1];
        if (lastContent.title === '' || lastContent.description === '' || lastContent.videoUrl === '' || lastContent.links[0].title === '' || lastContent.links[0].url === '') {
            toast.error('Please fill all the fields');
        } else {
            let newVideoSection = '';
            if (courseContentData.length > 0) {
                const lastVideoSection = courseContentData[courseContentData.length - 1].videoSection;
                if (lastVideoSection) {
                    newVideoSection = lastVideoSection;
                };
            }
            const newContent = {
                videoUrl: '',
                title: '',
                description: '',
                videoSection: newVideoSection,
                links: [{ title: '', url: '' }],
            };
            setCourseContentData([...courseContentData, newContent]);
        }
    };
  
    const handleAddNewSection = () => {
        if (
            courseContentData[courseContentData.length - 1].title === '' ||
            courseContentData[courseContentData.length - 1].description === '' ||
            courseContentData[courseContentData.length - 1].videoUrl === '' ||
            courseContentData[courseContentData.length - 1].links[0].title === '' ||
            courseContentData[courseContentData.length - 1].links[0].url === ''
        ) {
            toast.error('Please fill all the fields');
        } else {
            setActiveSection(activeSection + 1);
            const newCourseContentData = {
                videoUrl: '',
                title: '',
                description: '',
                videoSection: `Untitled Section ${activeSection}`,
                links: [{ title: '', url: '' }],
            };
            setCourseContentData([...courseContentData, newCourseContentData]);
        }
    };

    const prevButton = () => {
        if (active > 0) {
            setActive(active - 1);
        }
    };

    const handleOptions = () => {
        if (
            courseContentData[courseContentData.length - 1].title === '' ||
            courseContentData[courseContentData.length - 1].description === '' ||
            courseContentData[courseContentData.length - 1].videoUrl === '' ||
            courseContentData[courseContentData.length - 1].links[0].title === '' ||
            courseContentData[courseContentData.length - 1].links[0].url === ''
        ) {
            toast.error(`Secsion can't be empty`);
        } else {
            setActive(active + 1);
            handleCourseSubmit();
        }
    };

    return (
        <div className="w-[80%] m-auto mt-18 p-3">
            <form onSubmit={handleSubmit}>
                {courseContentData.map((item, index) => {
                    const showSectionInput =
                        index === 0 ||
                        item.videoSection !== courseContentData[index - 1].videoSection;
                    return (
                        <>
                            <div
                                className={`w-full p-4 bg-[#1f2530] ${showSectionInput ? "mt-10" : "mb-0"
                                    }`}
                            >
                                {showSectionInput && (
                                    <>
                                        <div className="flex w-full items-center">
                                            <input
                                                type="text"
                                                className={`text-[20px] ${item.videoSection === "Untitled Section"
                                                    ? "w-[100px]"
                                                    : "w-min"
                                                    } cursor-pointer bg-transparent outline-none`}
                                                value={item.videoSection}
                                                onChange={(e) => {
                                                    const newCourseContentData = [...courseContentData];
                                                    newCourseContentData[index].videoSection =
                                                        e.target.value;
                                                    setCourseContentData(newCourseContentData);
                                                }}
                                            />
                                            <PencilIcon className="cursor-pointer w-5 h-5" />
                                        </div>
                                        <br />
                                    </>
                                )}
                                <div className="w-full flex items-center justify-between my-0">
                                    {isCollapsed[index] ? (
                                        <>
                                            {item.title ? (
                                                <p>
                                                    {index + 1}. {item.title}
                                                </p>
                                            ) : (
                                                <></>
                                            )}
                                        </>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div className="flex items-center">
                                        <DeleteOutline
                                            className={`text-[20px] mr-2 ${index > 0 ? "cursor-pointer" : "cursor-no-drop"
                                                }`}
                                            onClick={() => {
                                                if (index > 0) {
                                                    const updateData = [...courseContentData];
                                                    updateData.splice(index, 1);
                                                    setCourseContentData(updateData);
                                                }
                                            }}
                                        />
                                        <KeyboardArrowDown
                                            fontSize="large"
                                            className={`text-[20px] ${isCollapsed[index] ? "rotate-180" : "rotate-0"
                                                } transition-all duration-300`}
                                            onClick={() => handleCollapseToggle(index)}
                                        />
                                    </div>
                                </div>
                                {!isCollapsed[index] && (
                                    <>
                                        <div className="my-3">
                                            <label className="block text-sm font-medium mb-2">
                                                Video Title
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full mt-4 p-2 border border-[#343a46] rounded bg-transparent"
                                                value={item.title}
                                                onChange={(e) => {
                                                    const updateData = [...courseContentData];
                                                    updateData[index].title = e.target.value;
                                                    setCourseContentData(updateData);
                                                }}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium mb-2">
                                                Video URL
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full mt-4 p-2 border border-[#343a46] rounded bg-transparent"
                                                value={item.videoUrl}
                                                onChange={(e) => {
                                                    const updateData = [...courseContentData];
                                                    updateData[index].videoUrl = e.target.value;
                                                    setCourseContentData(updateData);
                                                }}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium mb-2">
                                                Video Description
                                            </label>
                                            <textarea
                                                rows={8}
                                                cols={30}
                                                type="text"
                                                className="w-full mt-4 p-2 border border-[#343a46] rounded bg-transparent"
                                                value={item.description}
                                                onChange={(e) => {
                                                    const updateData = [...courseContentData];
                                                    updateData[index].description = e.target.value;
                                                    setCourseContentData(updateData);
                                                }}
                                            />
                                        </div>
                                        {item?.links.map((link, linkIndex) => (
                                            <div key={linkIndex} className="mb-3 block">
                                                <div className="w-full flex items-center justify-between">
                                                    <label className="block text-sm font-medium mb-2">
                                                        Link {linkIndex + 1}
                                                    </label>
                                                    <DeleteOutline
                                                        className={`${linkIndex > 0
                                                            ? "cursor-pointer"
                                                            : "cursor-no-drop"
                                                            } text-[20px]`}
                                                        onClick={() =>
                                                            linkIndex > 0 &&
                                                            handleRemoveLink(index, linkIndex)
                                                        }
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    className="w-full mt-4 p-2 border border-[#343a46] rounded bg-transparent"
                                                    value={link.title}
                                                    placeholder="Title"
                                                    onChange={(e) => {
                                                        const updateData = [...courseContentData];
                                                        updateData[index].links[linkIndex].title =
                                                            e.target.value;
                                                        setCourseContentData(updateData);
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    className="w-full mt-4 p-2 border border-[#343a46] rounded bg-transparent"
                                                    value={link.url}
                                                    placeholder="Link URL"
                                                    onChange={(e) => {
                                                        const updateData = [...courseContentData];
                                                        updateData[index].links[linkIndex].url =
                                                            e.target.value;
                                                        setCourseContentData(updateData);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                        <div className="inline-block mb-2 mt-3">
                                            <p className="flex items-center text-[14px] cursor-pointer" onClick={() => handleAddLink(index)}>
                                                <LinkOutlined className="mr-2" />Add Link
                                            </p>
                                        </div>
                                    </>
                                )}
                                {
                                    index === courseContentData.length - 1 && (
                                        <div>
                                            <p className="flex items-center text-[14px] mt-3 cursor-pointer" onClick={() => handleNewContent(item)}>
                                                <PlusCircleIcon className="mr-2 h-5" />Add New Content
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
                        </>
                    );
                })}
                <div className="flex mt-4 items-center text-[14px] cursor-pointer" onClick={() => handleAddNewSection()}>
                    <PlusCircleIcon className="mr-2 h-5" />Add New Section
                </div>
            </form>
            <div className='mb-6 mt-3'>
                <div className='flex justify-between items-center'>
                    <button
                        className="px-4 py-2 bg-[#58c4dc] rounded text-white mt-4 cursor-pointer dark:bg-[#58c4dc] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => prevButton()}
                    >
                        Prev
                    </button>
                    <button
                        className="px-4 py-2 bg-[#58c4dc] rounded text-white mt-4 cursor-pointer dark:bg-[#58c4dc]"
                        onClick={() => handleOptions()}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseContent;
