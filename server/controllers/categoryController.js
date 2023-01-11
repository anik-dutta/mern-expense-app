const User = require('../models/User.js');

const create = async (req, res) => {
    try {
        const { label, date } = req.body;

        const response = await User.findByIdAndUpdate(req.user._id, { $set: { categories: [...req.user.categories, { label }] } }, { new: true }).select({ __v: 0, updatedAt: 0, createdAt: 0, password: 0 });

        res.json({ message: 'Added Successfully', response });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { label } = req.body;

        const response = await User.findByIdAndUpdate(req.user._id, {
            $set: {
                categories: req.user.categories.map((category) => {
                    if (category._id == req.params.id) {
                        return { label };
                    }
                    return category;
                }),
            },
        }, { new: true }).select({ __v: 0, updatedAt: 0, createdAt: 0, password: 0 });

        res.json({ message: 'Category Updated Successfully', response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const destroy = async (req, res) => {
    try {
        const { categories } = req.user;

        const newCategories = categories.filter(
            (category) => category._id != req.params.id
        );

        const user = await User.findByIdAndUpdate(req.user._id, { $set: { categories: newCategories } });

        res.json({ message: 'Category Deleted Successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { create, destroy, update };