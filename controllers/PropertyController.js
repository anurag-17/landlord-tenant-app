const { default: mongoose } = require("mongoose");
const Property = require("../models/Property");
const User = require("../models/User");
const calculateDistance = require("../utils/DistanceCalculate");
const CsvParser = require("json2csv").Parser;
// Controller function to add a new property
exports.addProperty = async (req, res) => {
  try {
    // Extract property details from the request body
    const {
      title,
      area,
      description,
      availabilityDate,
      BedRoom,
      BathRoom,
      furnishedType,
      listingType,
      category,
      collegeName,
      location,
      photos,
      price,
      priceRecur,
      feature,
      preference,
      ageGroup,
      provinces,
      address,
      noOfMales,
      noOfFemales,
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
      noOfMales,
      noOfFemales,
      BedRoom,
      BathRoom,
      furnishedType,
      collegeName,
      priceRecur,
      availabilityDate,
      listingType,
      category,
      location,
      photos,
      price,
      feature,
      preference,
      ageGroup,
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
    const property = await Property.findById(id)
      .populate("category")
      .populate("preference")
      .populate("userId");

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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;

    let filter = {};

    if (title) filter.title = { $regex: new RegExp(title), $options: "i" };
    if (city) propertyFilter.city = new mongoose.Types.ObjectId(city);
    if (state) propertyFilter.state = new mongoose.Types.ObjectId(state);
    if (provinces) {
        // Assuming 'provinces' is an array of IDs
        propertyFilter.provinces = new mongoose.Types.ObjectId(provinces)
    }
    if (userId) filter.userId = new mongoose.Types.ObjectId(userId);
    // if (city) filter.city = { $regex: new RegExp(city), $options: "i" };
    if (address)
      filter.address = { $regex: new RegExp(address), $options: "i" };
    // if (state) filter.state = { $regex: new RegExp(state), $options: "i" };
    if (country)
      filter.country = { $regex: new RegExp(country), $options: "i" };
    if (listingType && listingType.length > 0)
      filter.listingType = { $all: listingType };

    if (price) {
      const priceFormat = price.split("-");
      if (
        priceFormat.length !== 2 ||
        !priceFormat.every((val) => !isNaN(parseFloat(val)))
      ) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid price format" });
      }
      const [minPrice, maxPrice] = priceFormat.map(Number);
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (searchQuery) {
      const searchFilter = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          // { city: { $regex: searchQuery, $options: "i" } },
          { country: { $regex: searchQuery, $options: "i" } },
          // { state: { $regex: searchQuery, $options: "i" } },
        ],
      };
      filter = { $and: [filter, searchFilter] };
    }

    const totalProperties = await Property.countDocuments(filter);
    const totalPages = Math.ceil(totalProperties / pageSize);
    const skip = (page - 1) * pageSize;

    const properties = await Property.find(filter)
      .populate("category")
      .populate("preference")
      .populate("userId")
      .populate("state")
      .populate("provinces")
      .populate("city")
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      properties,
      page,
      totalProperties,
      limit: pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("Error searching properties:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to search properties" });
  }
};

///controller of specific user///
exports.filterProperties = async (req, res) => {
  try {
    const {
      otherPreferences, //array
      userLocation,  //userLocation:{latitude:73.44,longitude:55.222}
      city,
      address,
      state,
      country,
      listingType, //array
      title,
      provinces,
      price, //{minPrice:10, maxPrice:12}
      reqDistance //number,
    } = req.body;
    const searchQuery = req.query.search;

    let propertyFilter = {};

    if (otherPreferences && otherPreferences.length > 0) {
      propertyFilter.preference = { $all: otherPreferences };
    }
    if (listingType && listingType.length > 0) {
      propertyFilter.listingType = { $all: listingType };
    }
    // if (city) propertyFilter.city = { $regex: new RegExp(city), $options: "i" };
    if (address)
      propertyFilter.address = { $regex: new RegExp(address), $options: "i" };
    // if (state) propertyFilter.state = { $regex: new RegExp(state), $options: "i" };
    if (country)
      propertyFilter.country = { $regex: new RegExp(country), $options: "i" };
    if (title) propertyFilter.title = { $regex: new RegExp(title), $options: "i" };
      if (city) propertyFilter.city = new mongoose.Types.ObjectId(city);
      if (state) propertyFilter.state = new mongoose.Types.ObjectId(state);
      if (provinces) {
        // Assuming 'provinces' is an array of IDs
        propertyFilter.provinces = new mongoose.Types.ObjectId(provinces)
    }
    if (price) {
      const [minPrice, maxPrice] = price.split("-").map(Number);
      propertyFilter.price = { $gte: minPrice, $lte: maxPrice };
    }
    if (searchQuery) {
      const searchFilter = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          // { city: { $regex: searchQuery, $options: "i" } },
          { country: { $regex: searchQuery, $options: "i" } },
          // { state: { $regex: searchQuery, $options: "i" } },
        ],
      };
      propertyFilter = { $and: [propertyFilter, searchFilter] };
    }
    console.log(propertyFilter);
    let properties = await Property.find(propertyFilter)
      .populate("category")
      .populate("preference")
      .populate("userId")
      .populate("state")
      .populate("provinces")
      .populate("city")

    if (userLocation && userLocation.latitude && userLocation.longitude) {
      // console.log("dasdas",userLocation);
      properties = properties.filter((property) => {
        // console.log("akkkk", property.location);
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
          // console.log(distance <= (reqDistance || 10));
          return distance <= (reqDistance || 10);
        } else {
          return false;
        }
      });
    }

    const totalProperties = properties.length;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const totalPages = Math.ceil(totalProperties / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalProperties);

    const paginatedProperties = properties.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      properties: paginatedProperties,
      page,
      totalPages,
      totalProperties,
      limit: pageSize,
    });
  } catch (error) {
    console.error("Error filtering properties:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to filter properties" });
  }
};

exports.addToWishlist = async (req, res) => {
  const { prodId } = req.body;
  const { _id } = req.user._id;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      // Remove the product from the wishlist
      user.wishlist = user.wishlist.filter((id) => id.toString() !== prodId);
      await user.save();
      res.json({
        success: true,
        message: "Product removed from wishlist",
        wishlist: user.wishlist,
        added: false,
      });
    } else {
      // Add the product to the wishlist
      user.wishlist.push(prodId);
      await user.save();
      res.json({
        success: true,
        message: "Product added to wishlist",
        wishlist: user.wishlist,
        added: true,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        error: "An error occurred while updating the wishlist",
      });
  }
};
exports.deleteAllWishlistItems = async (req, res) => {
  const { _id } = req.user._id;

  try {
    // Find the user by ID
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Clear the user's wishlist by setting it to an empty array
    user.wishlist = [];

    // Save the user to update the wishlist
    await user.save();

    res.json({ success: true, message: "All wishlist items deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        error: "An error occurred while deleting wishlist items",
      });
  }
};

exports.propertyData = async (req, res) => {
  try {
    let users = [];

    var invitationData = await Property.find({});

    invitationData.forEach((user) => {
      const { userId, availabilityDate, title, area, description, BedRoom, BathRoom, furnishedType, listingType, location, price, priceRecur, collegeName, address, city, state, country, pincode,totalrating} = user;
      users.push({ userId, availabilityDate, title, area, description, BedRoom, BathRoom, furnishedType, listingType, location, price, priceRecur, collegeName, address, city, state, country, pincode,totalrating});
    });
    const fields = [ "userId", "availabilityDate", "title", "area", "description", "BedRoom", "BathRoom", "furnishedType", "listingType", "location", "price", "priceRecur", "collegeName", "address", "city", "state", "country", "pincode","totalrating" ];
    const csvParser = new CsvParser({ fields });
    const data = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment: filename=PropertyData.csv");

    res.status(200).end(data);
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
}