const { default: mongoose } = require("mongoose");
const City = require("../models/City");
const College = require("../models/College");
const State = require("../models/State");


// Create a new college
exports.createCollege = async (req, res) => {
  try {
    // Destructure all fields from req.body
    const { name, cityId, campus, address, latitude, longitude } = req.body;

    //note :-  cityId is stateId

    // Check if the college already exists by name
    const existingCollege = await College.findOne({ name });
    if (existingCollege) {
      return res.status(400).json({ error: "College already exists" });
    }

    // Validate cityId as a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      return res.status(400).json({ error: "Invalid cityId format" });
    }

    // Validate cityId by checking if the city exists
    const cityExists = await State.findById(cityId);
    if (!cityExists) {
      return res.status(404).json({ error: "State not found" });
    }

    // Proceed to create the college with all provided details
    const newCollege = new College({
      name,
      cityId,
      campus,
      address,
      latitude,
      longitude
    });
    await newCollege.save();
    res.status(201).json({ success: true, data: newCollege });
  } catch (error) {
    console.error("Create College Error:", error);
    res.status(500).json({ success: false, error: "Failed to create college" });
  }
};

exports.updateCollege = async (req, res) => {
  const { id } = req.params; // Assuming the college's ID is passed as a URL parameter
  const updates = req.body;

  try {
    // Validate cityId as a valid MongoDB ObjectId if provided
    if (updates.cityId && !mongoose.Types.ObjectId.isValid(updates.cityId)) {
      return res.status(400).json({ error: "Invalid stateId format" });
    }

    // Check if the city exists if cityId is provided
    if (updates.cityId) {
      const cityExists = await State.findById(updates.cityId);
      if (!cityExists) {
        return res.status(404).json({ error: "State not found" });
      }
    }

    // Update the college by ID with only the fields provided in the payload
    const updatedCollege = await College.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedCollege) {
      return res
        .status(404)
        .json({ success: false, message: "College not found" });
    }

    // Return success response with updated college data
    res.status(200).json({ success: true, data: updatedCollege });
  } catch (error) {
    console.error("Update College Error:", error);
    res.status(500).json({ success: false, error: "Failed to update college" });
  }
};
exports.deleteCollege = async (req, res) => {
  const { id } = req.params; // Assuming the college's ID is passed as a URL parameter

  try {
    // Attempt to delete the college by its ID
    const deletedCollege = await College.findByIdAndDelete(id);

    // If no college was found and deleted, return a 404 response
    if (!deletedCollege) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // Return success response after deletion
    res.status(200).json({
      success: true,
      message: "College deleted successfully",
    });
  } catch (error) {
    console.error("Delete College Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete college",
    });
  }
};

exports.getAllColleges = async (req, res) => {
  // Default page number and page size
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const searchQuery = req.query.search || "";

  // Calculate the skipping of documents
  const skip = (page - 1) * limit;

  try {
    let query = {};

    // If a search query is provided, adjust the query to filter by name
    if (searchQuery.trim()) {
      query.name = { $regex: searchQuery, $options: "i" }; // case-insensitive search
    }

    // Retrieve colleges with pagination and optional search
    const colleges = await College.find(query)
      .populate("cityId")
      .skip(skip)
      .limit(limit);

    // Count the total documents for pagination
    const total = await College.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: colleges.length,
      total,
      currentPage: page,
      totalPages,
      data: colleges,
    });
  } catch (error) {
    console.error("Get All Colleges Error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve colleges" });
  }
};
exports.getCollegeById = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  try {
    // Attempt to find the college by its ID
    const college = await College.findById(id);

    // If no college is found, return a 404 Not Found response
    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    // If a college is found, return it with a 200 OK response
    res.status(200).json({
      success: true,
      data: college,
    });
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error("Error fetching college by ID:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch college",
    });
  }
};
exports.getCollegesByCityId = async (req, res) => {
  const { cityId } = req.params; // Assuming you pass the city's ID as a URL parameter

  try {
    // Find colleges that have the specified cityId
    const colleges = await College.find({ cityId: cityId }).populate("cityId");

    // If no colleges are found for the city, return a 404 response
    if (!colleges.length) {
      return res.status(404).json({
        success: false,
        message: "No colleges found for the specified city",
      });
    }

    // Return the found colleges with a 200 OK response
    res.status(200).json({
      success: true,
      data: colleges,
    });
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error("Error fetching colleges by city ID:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch colleges",
    });
  }
};
