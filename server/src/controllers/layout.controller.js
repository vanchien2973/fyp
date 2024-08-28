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
            const { image, title, subtitle } = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image, { folder: 'layout' });
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subtitle
            }
            await LayoutModel.create({ banner: { image, title, subtitle } });
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
            const { image, title, subtitle } = req.body;
            if (bannerData) {
                await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
            }
            const myCloud = await cloudinary.v2.uploader.upload(image, { folder: 'layout' });
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subtitle
            }
            await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
        }
        if (type === 'FAQ') {
            const { faq } = req.body;
            const faqData = await LayoutModel.findOne({ type: 'FAQ'});
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
            const categoriesData = await LayoutModel.findOne({ type: 'Categories'});
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
        const { type } = req.body;
        const layout = await LayoutModel.findOne({ type });
        res.status(200).json({
            success: true,
            layout,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});