import { Category } from "../models/categoryModels.js";



export const createCategory = async (req, res) => {
    try {
        const { category } = req.body;

        const existingCategory = await Category.findOne({ category });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const newCategory = new Category({ name: category });
        await newCategory.save();

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
}

export const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
}