const Category = require("../models/Category");
const validateMongoDbId = require("../utils/validateMongodbId");

exports.createCategory = async (req, res) => {
  try {
    const { title } = req.body;

    const existingCategory = await Category.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: "Category with this title already exists",
      });
    }

    const newCategory = await Category.create({ title });
    return res.status(201).json({ success: true, newCategory });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.json({ success: true, updatedCategory });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deletedCategory = await Category.findById(id);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    await Category.deleteOne({ _id: id });

    return res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

exports.deleteBulkCategory = async (req, res) => {
  try {
    const { CategoryIds } = req.body;
    const deleteCategorys = await Category.deleteMany({
      _id: { $in: CategoryIds },
    });
    res.json({ success: true, deleteCategorys });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

exports.getCategory = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaCategory = await Category.findById(id);
    res.json({ success: true, getaCategory });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
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
    const totalPages = itemsPerPage
      ? Math.ceil(totalCategories / itemsPerPage)
      : 1;

    const skip = itemsPerPage ? (currentPage - 1) * itemsPerPage : 0;

    const getallCategory = await Category.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ title: 1 })
      .skip(skip)
      .limit(itemsPerPage);

    res.status(200).json({
      success: true,
      current_page: currentPage,
      total_pages: totalPages,
      total_items: totalCategories,
      categories: getallCategory,
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({success: false, error: "Internal Server Error" });
  }
};
