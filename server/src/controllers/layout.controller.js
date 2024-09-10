import CatchAsyncError from "../middlewares/CatchAsyncError";
import LayoutModel from "../models/layout.model";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from 'cloudinary';

// Create Layout (for Admin)
export const createLayout = CatchAsyncError(async (req, res, next) => {
    try {
        const { type } = req.body;
        const isTypeExist = await LayoutModel.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler(`${type} already exist`, 400));
        }
        if (type === 'Banner') {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image, { folder: 'layout' });
            const banner = {
                type: 'Banner',
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subTitle,
            }
            await LayoutModel.create(banner);
        }
        if (type === 'FAQ') {
            const { faq } = req.body;
            const faqItems = await Promise.all(
                faq.map(async (item) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await LayoutModel.create({ type: 'FAQ', faq: faqItems });
        }
        if (type === 'Categories') {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(
                categories.map(async (item) => {
                    return {
                        title: item.title,
                    }
                })
            )
            await LayoutModel.create({ type: 'Categories', categories: categoriesItems });
        }
        res.status(200).json({
            success: true,
            message: 'Layout created successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Edit Layout (for Admin)
export const editLayout = CatchAsyncError(async (req, res, next) => {
    try {
        const { type } = req.body;
        if (type === 'Banner') {
            const bannerData = await LayoutModel.findOne({ type: 'Banner' });
            const { image, title, subTitle } = req.body;
            let bannerImage = bannerData?.image;

            // Check if the image is a file or a URL
            if (image && typeof image === 'string' && !image.startsWith("https")) {
                // Image is a file, upload it to Cloudinary
                const uploadedImage = await cloudinary.v2.uploader.upload(image, {
                    folder: 'layout'
                });
                bannerImage = {
                    public_id: uploadedImage.public_id,
                    url: uploadedImage.secure_url
                };
            } else if (image && typeof image === 'string' && image.startsWith("https")) {
                // Image is a URL, check if it has changed
                if (bannerData?.image?.url !== image) {
                    bannerImage = {
                        public_id: bannerData?.image?.public_id,
                        url: image
                    };
                }
            } else {
                // No image change, keep the existing image
                bannerImage = bannerData?.image;
            }

            const banner = {
                type: "Banner",
                image: bannerImage,
                title,
                subTitle
            };
            await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
        }
        if (type === 'FAQ') {
            const { faq } = req.body;
            const faqData = await LayoutModel.findOne({ type: 'FAQ' });
            const faqItems = await Promise.all(
                faq.map(async (item) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(faqData?._id, { type: 'FAQ', faq: faqItems });
        }
        if (type === 'Categories') {
            const { categories } = req.body;
            const categoriesData = await LayoutModel.findOne({ type: 'Categories' });
            const categoriesItems = await Promise.all(
                categories.map(async (item) => {
                    return {
                        title: item.title,
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(categoriesData._id, { type: 'Categories', categories: categoriesItems });
        }
        res.status(200).json({
            success: true,
            message: 'Layout updated successfully'
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get Layout by Type (for Admin)
export const getLayout = CatchAsyncError(async (req, res, next) => {
    try {
        const { type } = req.params;
        const layout = await LayoutModel.findOne({ type });
        res.status(200).json({
            success: true,
            layout,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});