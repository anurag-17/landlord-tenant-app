const City = require("../models/City");

exports.addcity = async (req, res) => {
  const { name, stateId } = req.body;
  try {
    const addState = new City({ name, stateId });
    await addState.save();
    // Return success response
    return res.status(201).json({
      success: true,
      message: "city added successfully",
      city: addState,
    });
  } catch (error) {
    console.error("Error adding city:", error);
    res.status(500).json({ success: false, error: "Failed to add city" });
  }
};

exports.updateCity = async (req, res) => {
  const { id } = req.params; // Assuming you pass the city's ID as a URL parameter
  const updates = req.body; // All updates

  // Construct an update object dynamically based on what's provided in the request body
  let updateFields = {};
  for (let key in updates) {
    if (updates[key] !== undefined) {
      // Ensure the field is not undefined
      updateFields[key] = updates[key];
    }
  }

  try {
    // Find the city by ID and update it with the constructed update object
    const updatedCity = await City.findByIdAndUpdate(
      id,
      {
        $set: updateFields,
      },
      { new: true, runValidators: true }
    ); // Ensure validators run

    if (!updatedCity) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "City updated successfully",
      city: updatedCity,
    });
  } catch (error) {
    console.error("Error updating city:", error);
    res.status(500).json({ success: false, error: "Failed to update city" });
  }
};

exports.deleteCity = async (req, res) => {
  const { id } = req.params; // Assuming you pass the city's ID as a URL parameter

  try {
    const city = await City.findByIdAndDelete(id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting city:", error);
    res.status(500).json({ success: false, error: "Failed to delete city" });
  }
};

exports.getCities = async (req, res) => {
  const { page = 1, limit = 999999, search } = req.query; // Defaults to page 1 and limit 10 items per page
  let query = {};
  const currentPage = parseInt(page, 10);
  // If there's a search query, adjust the query object to filter by name
  if (search) {
    query.name = { $regex: search, $options: "i" }; // Case-insensitive search
  }

  try {
    // Find all cities with pagination and optional search query
    // Adjust the projection as needed
    const cities = await City.find(query).populate("stateId")
      .limit(limit * 1)
      .skip((currentPage - 1) * limit)
      .exec();

    // Count how many total documents are in the collection
    const count = await City.countDocuments(query);

    // Return success response with cities data, total count, and pagination info
    return res.status(200).json({
      success: true,
      totalCount: count,
      currentPage,
      totalPages: Math.ceil(count / limit),
      data: cities,
    });
  } catch (error) {
    console.error("Error retrieving cities:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve cities" });
  }
};
exports.getCityByStateId = async (req, res) => {
  const { stateId } = req.params; // Assuming you pass the state's ID as a URL parameter

  try {
    // Find all cities belonging to the specified state
    const cities = await City.find({ stateId: stateId }).populate("stateId");

    if (!cities || cities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cities found for the provided state ID",
      });
    }

    // Return success response with cities data
    return res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error("Error retrieving cities by state ID:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve cities" });
  }
};

exports.getCityById = async (req, res) => {
  const { id } = req.params; // Assuming the city's ID is passed as a URL parameter

  try {
    // Find the city by its ID
    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    // Return success response with the city data
    return res.status(200).json({
      success: true,
      data: city,
    });
  } catch (error) {
    console.error("Error retrieving city:", error);
    res.status(500).json({ success: false, error: "Failed to retrieve city" });
  }
};
