import { useEditLayoutMutation, useGetHeroDataQuery } from "@/app/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Camera } from "lucide-react";
import { Textarea } from "../../ui/textarea";
import toast from "react-hot-toast";

const EditHero = () => {
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const { data, refetch } = useGetHeroDataQuery("Banner", {
        refetchOnMountOrArgChange: true,
    });
    const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

    useEffect(() => {
        if (data) {
            setTitle(data?.layout?.banner.title);
            setSubTitle(data?.layout?.banner.subTitle);
            setImage(data?.layout?.banner?.image?.url);
        }
    }, [data]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Hero updated successfully!");
            refetch();
        }
    }, [isSuccess, refetch]);

    useEffect(() => {
        if (error && error.data) {
            toast.error(error.data.message);
        }
    }, [error]);

    const handleUpdate = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = (e) => {
                if (reader.readyState === 2) {
                    setImage(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = async () => {
        await editLayout({
            type: "Banner",
            image,
            title,
            subTitle
        }).unwrap();
    };

    return (
        <>
            {/* Hero */}
            <div className="container py-24 lg:py-32">
                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
                    <div>
                        <Textarea
                            placeholder="Unlock the Power of the English with Our Expert Courses"
                            value={title}
                            rows={3}
                            onChange={(e) => setTitle(e.target.value)}
                            className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
                        ></Textarea>
                        <Textarea
                            placeholder="Are you ready to embark on an exciting journey into the world of web development?"
                            value={subTitle}
                            rows={3}
                            onChange={(e) => setSubTitle(e.target.value)}
                            className="mt-3 text-xl text-muted-foreground"
                        ></Textarea>
                        {/* Buttons */}
                        <div className="mt-7 grid gap-3 w-full sm:inline-flex">
                            <Button size={"lg"}>Get started</Button>
                            <Button variant={"outline"} size={"lg"}>
                                Take Entrance Test
                            </Button>
                        </div>
                    </div>
                    {/* Col */}
                    <div className="relative ms-4">
                        <img className="w-full rounded-md" src={image} alt="Uploaded image" />
                        <input
                            type="file"
                            id="banner"
                            accept="image/*"
                            onChange={handleUpdate}
                            className="hidden"
                        />
                        <div className="mt-7 grid gap-3 w-full sm:inline-flex">
                            <Button asChild size="lg">
                                <label htmlFor="banner">
                                    <Camera className="cursor-pointer text-[18px]" />
                                </label>
                            </Button>
                        </div>
                    </div>
                    {/* End Col */}
                </div>
                {/* End Grid */}
                {/* Navigation */}
            <div className="mt-8 pt-5">
                <div className="flex justify-end">
                    <Button
                        type="button"
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={
                            () => handleEdit()
                        }
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
            </div>
            {/* End Hero */}
            
        </>
    );
};

export default EditHero;
