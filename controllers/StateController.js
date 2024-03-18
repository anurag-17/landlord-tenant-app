const State = require("../models/State");

exports.addState = async (req, res) => {
  const { name } = req.body;
  try {
    const addState = new State({ name });
    await addState.save();
    // Return success response
    return res.status(201).json({
      success: true,
      message: "State added successfully",
      state: addState,
    });
  } catch (error) {
    console.error("Error adding state:", error);
    res.status(500).json({ success: false, error: "Failed to add State" });
  }
};

exports.updateState = async (req, res) => {
    const { id } = req.params; // Assuming the state's ID is passed as a URL parameter
    const { name } = req.body; // The new name for the state
  
    try {
      // Attempt to update the state with the given ID
      const updatedState = await State.findByIdAndUpdate(id, { name }, { new: true });
  
      // If no state was found to update, return a 404 not found response
      if (!updatedState) {
        return res.status(404).json({
          success: false,
          message: "State not found."
        });
      }
  
      // Return success response with the updated state
      return res.status(200).json({
        success: true,
        message: "State updated successfully",
        state: updatedState
      });
    } catch (error) {
      // Log the error and return a 500 internal server error response
      console.error("Error updating state:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update state"
      });
    }
  };

  exports.deleteState = async (req, res) => {
    const { id } = req.params; // Assuming the state's ID is passed as a URL parameter
  
    try {
      // Attempt to find and delete the state with the given ID
      const deletedState = await State.findByIdAndDelete(id);
  
      // If no state was found to delete, return a 404 not found response
      if (!deletedState) {
        return res.status(404).json({
          success: false,
          message: "State not found."
        });
      }
  
      // Return success response indicating the state was successfully deleted
      return res.status(200).json({
        success: true,
        message: "State deleted successfully"
      });
    } catch (error) {
      // Log the error and return a 500 internal server error response
      console.error("Error deleting state:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete state"
      });
    }
  };
  
  exports.getAllStates = async (req, res) => {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 100; // Default to 10 items per page if not provided
    const search = req.query.search || ''; // Search query, default is empty to fetch all
  
    // Calculate the 'skip' value
    const skip = (page - 1) * limit;
  
    try {
      // Find states with a name matching the search query, sort them by name, and apply pagination
      const states = await State.find({
        name: { $regex: search, $options: 'i' } // Case-insensitive regex search
      })
      .sort({ name: 1 }) // Sort by name in ascending order
      .skip(skip) // Skip the previous pages
      .limit(limit); // Limit the result
  
      // Count the total number of states matching the search criteria (without pagination)
      const total = await State.countDocuments({
        name: { $regex: search, $options: 'i' }
      });
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(total / limit);
  
      // Return the states with pagination information
      return res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalStates: total,
        limit: limit,
        states: states
      });
    } catch (error) {
      console.error("Error fetching states:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch states"
      });
    }
  };
  