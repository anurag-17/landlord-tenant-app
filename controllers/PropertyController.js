const Property = require("../models/Property");
const User = require("../models/User");

// Controller function to add a new property
exports.addProperty = async (req, res) => {
  try {
    // Extract property details from the request body
    const {
      title,
      area,
      description,
      numberOfRooms,
      furnishedType,
      listingType,
      category,
      location,
      photos,
      price,
      feature,
      preference,
      ageGroup,
      university,
      gender,
      eatPrefer,
      smoke_drinkPrefer,
      PetPrefer,
      provinces,
    } = req.body;

    // Create a new Property object
    const newProperty = new Property({
      userId:req.user._id,  
      title,
      area,
      description,
      numberOfRooms,
      furnishedType,
      listingType,
      category,
      location,
      photos,
      price,
      feature,
      preference,
      ageGroup,
      university,
      gender,
      eatPrefer,
      smoke_drinkPrefer,
      PetPrefer,
      provinces,
    });

    // Save the property to the database
    await newProperty.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: "Property added successfully",
      property: newProperty,
    });
  } catch (error) {
    // Return error response if something goes wrong
    console.error("Error adding property:", error);
    res.status(500).json({ success: false, error: "Failed to add property" });
  }
};

// Controller function to get a property by ID
exports.getPropertyById = async (req, res) => {
  try {
    // Extract the property ID from the request parameters
    const { id } = req.params;

    // Find the property in the database by its ID
    const property = await Property.findById(id);

    // Check if the property exists
    if (!property) {
      return res
        .status(404)
        .json({ success: false, error: "Property not found" });
    }
    // const user = await User.findById(property.userId)
    // if (user && user.isBlocked) {
    //     return res
    //     .status(404)
    //     .json({ success: false, error: "Property owner is blocked." }); 
    // }
    // if (property && property.isBlocked) {
    //     return res
    //     .status(404)
    //     .json({ success: false, error: "Property is blocked." }); 
    // }
    // Return the property
    res.status(200).json({ success: true, property });
  } catch (error) {
    // Return error response if something goes wrong
    console.error("Error getting property by ID:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to get property by ID" });
  }
};

// Controller function to edit a property by ID
exports.editProperty = async (req, res) => {
  try {
    // Extract the property ID from the request parameters
    const { id } = req.params;

    // Extract the updated property details from the request body
    const updateFields = req.body;

    // Find the property in the database by its ID and update it
    const updatedProperty = await Property.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    // Check if the property exists
    if (!updatedProperty) {
      return res
        .status(404)
        .json({ success: false, error: "Property not found" });
    }

    // Return the updated property
    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    // Return error response if something goes wrong
    console.error("Error editing property:", error);
    res.status(500).json({ success: false, error: "Failed to edit property" });
  }
};

// Controller function to delete a property by ID
exports.deletePropertyById = async (req, res) => {
  try {
    // Extract the property ID from the request parameters
    const { id } = req.params;

    // Find the property in the database by its ID and delete it
    const deletedProperty = await Property.findByIdAndDelete(id);

    // Check if the property exists
    if (!deletedProperty) {
      return res
        .status(404)
        .json({ success: false, error: "Property not found" });
    }

    // Return success message
    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    // Return error response if something goes wrong
    console.error("Error deleting property:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete property" });
  }
};

// Controller function to search properties by title and provinces with pagination
exports.searchProperties = async (req, res) => {
    try {
      // Extract search query parameters from query parameters
      const { title, provinces } = req.query;
  
      // Extract page number and page size from query parameters, with default values if not provided
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 10;
  
      // Create a filter object based on search parameters
      const filter = {};
      if (title) filter.title = { $regex: new RegExp(title), $options: "i" }; // Case-insensitive search by title
      if (provinces) filter.provinces = { $regex: new RegExp(provinces), $options: "i" }; // Case-insensitive search by provinces
  
      // Calculate skip value based on page number and page size
      const skip = (page - 1) * pageSize;
  
      // Fetch properties from the database with pagination and search filters
      const properties = await Property.find(filter).skip(skip).limit(pageSize);
  
      // Return properties along with pagination metadata
      res.status(200).json({ success: true, properties, page, pageSize });
    } catch (error) {
      // Return error response if something goes wrong
      console.error("Error searching properties:", error);
      res.status(500).json({ success: false, error: "Failed to search properties" });
    }
  };
  