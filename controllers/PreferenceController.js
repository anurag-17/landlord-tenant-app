const Preference = require("../models/Preferences");
const validateMongoDbId = require("../utils/validateMongodbId");

exports.createPreference = async (req, res) => {
  try {
    const { preference } = req.body;

    const existingPreference = await Preference.findOne({ preference });

    if (existingPreference) {
      return res.status(400).json({ error: 'Preference already exists' });
    }

    const newPreference = await Preference.create({ preference });
    res.status(201).json({success: true, newPreference});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({success: false, error: 'Internal Server Error' });
  }
};

exports.updatePreference = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  
  try {
    const updatedPreference = await Preference.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // console.log(updatedPreference);
   return res.json({success: true,updatedPreference});
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({success: false, error: 'Internal Server Error' });
  }
};

exports.deletePreference = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deletedPreference = await Preference.findByIdAndDelete(id);

    if (!deletedPreference) {
      return res.status(404).json({success: true, error: "Preference not found" });
    }

    return res.json({success: true, message: "Preference deleted successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({success: false, error: "Internal Server Error" });
  }
};

exports.getPreference = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const preference = await Preference.findById(id);
    res.json({success: true,preference});
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({success: false, error: "Internal Server Error" });
  }
};

exports.getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.find();
    res.status(200).json({success: true,preferences});
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({success: false, error: "Internal Server Error" });
  }
};
