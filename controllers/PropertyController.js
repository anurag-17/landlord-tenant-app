const Property = require("../models/Property");
const User = require("../models/User");
const geolib = require("geolib");
const calculateDistance = require("../utils/DistanceCalculate");

// const { default: calculateDistance } = require("../utils/DistanceCalculate");

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
      address,
      city,
      state,
      country,
      pincode,
    } = req.body;

    // Create a new Property object
    const newProperty = new Property({
      userId: req.user._id,
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
      address,
      city,
      state,
      country,
      pincode,
    });

    // Save the property to the database
    await newProperty.save();

    // Return success response
    return res.status(201).json({
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
    return res.status(200).json({ success: true, property });
  } catch (error) {
    // Return error response if something goes wrong
    console.error("Error getting property by ID:", error);
    return res
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
    console.log(updateFields);
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
    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    // Return error response if something goes wrong
    console.error("Error editing property:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to edit property" });
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
    return res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    // Return error response if something goes wrong
    console.error("Error deleting property:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete property" });
  }
};

// Controller function to search properties by title and provinces with pagination
exports.searchProperties = async (req, res) => {
  try {
    // Extract search query parameters from query parameters
    const {
      title,
      provinces,
      userId,
      city,
      address,
      state,
      country,
      listingType,
      price,
    } = req.body;
    const searchQuery = req.query.search;

    // Extract page number and page size from query parameters, with default values if not provided
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;

    // Create a filter object based on search parameters
    let filter = {};
    if (title) filter.title = { $regex: new RegExp(title), $options: "i" }; // Case-insensitive search by title
    if (provinces)
      filter.provinces = { $regex: new RegExp(provinces), $options: "i" }; // Case-insensitive search by provinces
    if (userId) {
      filter.userId = { $regex: new RegExp(userId), $options: "i" };
    }
    ///if city
    if (city) filter.city = { $regex: new RegExp(city), $options: "i" };
    //if address
    if (address)
      filter.address = { $regex: new RegExp(address), $options: "i" };
    //if state
    if (state) filter.state = { $regex: new RegExp(state), $options: "i" };
    //if country
    if (country)
      filter.country = { $regex: new RegExp(country), $options: "i" };
    //
    // If lsitingtype are provided, add them to the property filter
    if (listingType && listingType.length > 0) {
      filter.listingType = { $all: listingType };
    }
    // if price is provided
    if (price) {
      // Extract min and max price values from the provided string
      const [minPriceStr, maxPriceStr] = price.split("-").map(Number);
      // Convert string price values to numbers
      const minPrice = parseFloat(minPriceStr);
      const maxPrice = parseFloat(maxPriceStr);
      console.log(minPrice, maxPrice); 
      // Add price range filter to the property filter
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
      } else {
        // Handle invalid price format
        return res.status(400).json({ success: false, error: "Invalid price format" });
      }
    }
     // If there's a search query, add it to the filter
     if (searchQuery) {
      const searchFilter = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { city: { $regex: searchQuery, $options: 'i' } },
          { country: { $regex: searchQuery, $options: 'i' } },
          { state: { $regex: searchQuery, $options: 'i' } },
        ]
      };
      // Merge existing filter with search filter using $and
      filter = { $and: [filter, searchFilter] };
    }
    // Count total number of properties matching the filter
    const totalProperties = await Property.countDocuments(filter);

    // Calculate total number of pages
    const totalPages = Math.ceil(totalProperties / pageSize);
    // Calculate skip value based on page number and page size
    const skip = (page - 1) * pageSize;

    // Fetch properties from the database with pagination and search filters
    const properties = await Property.find(filter).skip(skip).limit(pageSize);

    // Return properties along with pagination metadata
    return res.status(200).json({
      success: true,
      properties,
      page,
      totalProperties,
      limit: pageSize,
      totalPages,
    });
  } catch (error) {
    // Return error response if something goes wrong
    console.error("Error searching properties:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to search properties" });
  }
};

///controller of specific user///
exports.filterProperties = async (req, res) => {
  try {
    // Extract user preferences and otherPreferences from request body
    const {
      tenantId,
      otherPreferences,
      userLocation,
      city,
      address,
      state,
      country,
      listingType,
      title,
      provinces,
      price,
    } = req.body;
    const searchQuery = req.query.search;
    // Fetch user preferences from the database based on userId
    const user = await User.findById(tenantId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Failed to fetch tenant" });
    }
    // Extract user preferences
    const { genderPrefer, eatPrefer, smoke_drinkPrefer, PetPrefer } = user;

    // Construct filter object for property query
    const propertyFilter = {};

    // Apply user preferences to property filter
    const genderCriteria = [
      { gender: genderPrefer.trim().toLowerCase() },
      { gender: "any" },
    ];
    const eatCriteria = [
      { eatPrefer: eatPrefer.trim().toLowerCase() },
      { eatPrefer: "any" },
    ];
    const smokeDrinkCriteria = [
      { smoke_drinkPrefer: smoke_drinkPrefer.trim().toLowerCase() },
      { smoke_drinkPrefer: "any" },
    ];
    const petCriteria = [
      { PetPrefer: PetPrefer.trim().toLowerCase() },
      { PetPrefer: "any" },
    ];

    propertyFilter.$and = [{ isBlocked: false }];

    if (genderPrefer !== "any") {
      propertyFilter.$and.push({ $or: genderCriteria });
    }
    if (eatPrefer !== "any") {
      propertyFilter.$and.push({ $or: eatCriteria });
    }
    if (smoke_drinkPrefer !== "any") {
      propertyFilter.$and.push({ $or: smokeDrinkCriteria });
    }
    if (PetPrefer !== "any") {
      propertyFilter.$and.push({ $or: petCriteria });
    }

    // If otherPreferences are provided, add them to the property filter
    if (otherPreferences && otherPreferences.length > 0) {
      propertyFilter.preference = { $all: otherPreferences };
    }
    // If lsitingtype are provided, add them to the property filter
    if (listingType && listingType.length > 0) {
      propertyFilter.listingType = { $all: listingType };
    }
    ///if city
    if (city) propertyFilter.city = { $regex: new RegExp(city), $options: "i" };
    //if address
    if (address)
      propertyFilter.address = { $regex: new RegExp(address), $options: "i" };
    //if state
    if (state)
      propertyFilter.state = { $regex: new RegExp(state), $options: "i" };
    //if country
    if (country)
      propertyFilter.country = { $regex: new RegExp(country), $options: "i" };
    //title
    if (title)
      propertyFilter.title = { $regex: new RegExp(title), $options: "i" }; // Case-insensitive search by title
    //province
    if (provinces)
      propertyFilter.provinces = {
        $regex: new RegExp(provinces),
        $options: "i",
      }; // Case-insensitive search by provinces
    //price
    if (price) {
      // Extract min and max price values from the provided string
      const [minPrice, maxPrice] = price.split("-").map(Number);

      // Add price range filter to the property filter
      propertyFilter.price = { $gte: minPrice, $lte: maxPrice };
    }
    // If there's a search query, add it to the filter
    if (searchQuery) {
      const searchFilter = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { city: { $regex: searchQuery, $options: 'i' } },
          { country: { $regex: searchQuery, $options: 'i' } },
          { state: { $regex: searchQuery, $options: 'i' } },
        ]
      };
      // Merge existing filter with search filter using $and
      propertyFilter = { $and: [filter, searchFilter] };
    }

    // If user location is provided, filter properties within 5 km radius
    let properties = await Property.find(propertyFilter);
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      properties = properties.filter((property) => {
        // console.log(userLocation.longitude, property.location[0].longitude);
        if (
          property.location &&
          property.location[0].latitude &&
          property.location[0].longitude
        ) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            property.location[0].latitude,
            property.location[0].longitude
          );
          console.log(distance);
          return distance <= 10;
        } else {
          return false; // Exclude properties without valid location
        }
      });
    }
    //   console.log(properties);

    // Extract pagination parameters from query parameters, with default values if not provided
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const totalProperties = properties.length;
    const totalPages = Math.ceil(totalProperties / pageSize);
    // Paginate the results
    const paginatedProperties = properties.slice(startIndex, endIndex);

    // Return paginated properties along with pagination metadata
    return res.status(200).json({
      success: true,
      properties: paginatedProperties,
      page,
      totalPages,
      totalProperties,
      limit: pageSize,
    });
  } catch (error) {
    // Return error response if something goes wrong
    console.error("Error filtering properties:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to filter properties" });
  }
};
