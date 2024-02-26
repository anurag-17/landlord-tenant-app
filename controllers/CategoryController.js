const Category = require("../models/Category");
const validateMongoDbId = require("../utils/validateMongodbId");

exports.createCategory = async (req, res) => {
  try {
    const { title } = req.body;

    const existingCategory = await Category.findOne({ title: { $regex: new RegExp(`^${title}$`, "i") } });
    
    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this title already exists' });
    }

    const newCategory = await Category.create({ title });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error', status: 500 });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  try {
    const deletedCategory = await Category.findById(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    await Category.deleteOne({ _id: id });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteBulkCategory = async (req, res) => {
  try {
    const { CategoryIds } = req.body;
    const deleteCategorys = await Category.deleteMany({ _id: { $in: CategoryIds } });
    res.json(deleteCategorys);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getCategory = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  try {
    const getaCategory = await Category.findById(id);
    res.json(getaCategory);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getallCategory = async (req, res) => {
  try {
    const { page, limit, searchQuery } = req.query;

    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(limit, 10) || undefined;

    let query = {};

    if (searchQuery) {
      query.title = { $regex: new RegExp(searchQuery, "i") };
    }

    const totalCategories = await Category.countDocuments(query);
    const totalPages = itemsPerPage ? Math.ceil(totalCategories / itemsPerPage) : 1;

    const skip = itemsPerPage ? (currentPage - 1) * itemsPerPage : 0;

    const getallCategory = await Category.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ title: 1 })
      .skip(skip)
      .limit(itemsPerPage);

    res.status(200).json({
      current_page: currentPage,
      total_pages: totalPages,
      total_items: totalCategories,
      categories: getallCategory,
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};