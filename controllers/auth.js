const User = require("../models/User");
const ErrorResponse = require("../utils/errorRes");
const sendEmail = require("../utils/sendEmail");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateToken, verifyToken } = require("../config/jwtToken");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");
const uploadOnS3 = require("../utils/uploadImage");
const Property = require("../models/Property");
const Preference = require("../models/Preferences");
const College = require("../models/College");
const State = require("../models/State");
const City = require("../models/City");
const Conversation = require("../models/Conversation");
const CsvParser = require("json2csv").Parser;

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Invalid request" });
    }

    let fileName = req.file.originalname;

    let url = await uploadOnS3(req.file.buffer, fileName);
    // console.log("URL:::=>", url);
    return res.status(200).json({ status: true, url: url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.register = async (req, res, next) => {
  const { email, mobile } = req.body;
  // console.log(req?.body?.provider_ID);
  try {
    const existingUser = await User.findOne({ email });
    if (mobile) {
      const existingMobile = await User.findOne({ mobile });
      if (existingMobile) {
        return res.status(400).json({
          success: false,
          error: "User with this contact number already exists.",
        });
      }
    }
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists.",
      });
    }

    const userData = {
      email,
      mobile: req.body.mobile,
      role: req.body.role,
      fullname: req.body.fullname,
      password: req.body.password,
      profilePicture: req?.body?.profilePicture,
      age: req?.body?.age,
      university: req?.body?.university,
      gender: req?.body?.gender,
      eatPrefer: req?.body?.eatPrefer,
      smoke_drinkPrefer: req?.body?.smoke_drinkPrefer,
      PetPrefer: req?.body?.PetPrefer,
      provinces: req?.body?.provinces,
      ageGroup: req?.body?.ageGroup,
      genderPrefer: req?.body?.genderPrefer,
      dateOfbirth: req?.body?.dateOfbirth,
      collegeName: req?.body?.collegeName,
      collegeProgram: req?.body?.collegeProgram,
      preference: req?.body?.preference,
      roomMateBio: req?.body?.roomMateBio,
      spokenLanguage: req?.body?.spokenLanguage,
      country: req?.body?.country,
      city: req?.body?.city,
      provider_ID: req?.body?.provider_ID,
    };

    const newUser = await User.create(userData);
    const token = generateToken({ email: newUser.email });

    const updatedUser = await User.findByIdAndUpdate(
      { _id: newUser._id?.toString() },
      { activeToken: token, lastLogin: Date.now() },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(401)
        .json({ success: false, error: "Failed to register" });
    }
    return res.status(200).json({ success: true, user: updatedUser, token });
    //  sendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};
exports.checkUserByProviderID = async (req, res) => {
  try {
    const { provider_ID,email } = req.params;

    // Check if the user with the provided provider_ID exists
    // const user = await User.findOne({ provider_ID });
    const user = await User.findOne({
      $or: [
        { provider_ID: provider_ID }, 
        { email: email }
      ]
    });
    // console.log("user",user);

    if (!user) {
      // If user does not exist
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // If user exists
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkUserByProviderID controller: ", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
exports.login = async (req, res) => {
  const { email, password, provider_ID } = req.body;

  if (!email || (!password && !provider_ID)) {
    return res.status(400).json({
      success: false,
      error: "Please provide email and password/provider ID",
    });
  }

  try {
    const userQuery = User.findOne({ email }).select("+password");
    const populateOptions = ["wishlist", "preference"];
    populateOptions.forEach((option) => userQuery.populate(option));
    const findUser = await userQuery;

    if (!findUser || findUser.isBlocked) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials or user is blocked",
      });
    }

    // const isValidLogin = password
    //   ? await findUser.matchPasswords(password)
    //   : findUser.provider_ID === provider_ID;


      let isValidLogin = false;

      if (password) {
        // console.log("password",password);
        isValidLogin = await findUser.matchPasswords(password);
      } else if (findUser.provider_ID === provider_ID || findUser.email === email) {
        // console.log("provider_ID",provider_ID);
        // console.log("email",email);

        isValidLogin = true;
      }
      
      // console.log("isValidLogin",isValidLogin);
      // return isValidLogin;
      
    if (!isValidLogin) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = generateToken({ email: findUser.email });
    await User.findByIdAndUpdate(findUser._id, {
      activeToken: token,
      lastLogin: Date.now(),
    });

    res.status(200).json({
      success: true,
      user: {
        findUser,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const findAdmin = await User.findOne({ email }).select("+password");

    if (!findAdmin) {
      throw new Error("Admin not found");
    }

    if (findAdmin.role !== "admin") {
      throw new Error("Not Authorized");
    }

    if (await findAdmin.matchPasswords(password)) {
      const token = generateToken({ email: findAdmin.email });
      await User.findByIdAndUpdate(
        { _id: findAdmin._id?.toString() },
        { activeToken: token },
        { new: true }
      );

      const user = {
        success: true,
        user: {
          _id: findAdmin._id,
          fullname: findAdmin.fullname,
          email: findAdmin.email,
          profilePicture: findAdmin.profilePicture,
        },
        token: token,
      };

      return res.status(200).json({ success: true, user });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    const token = authHeader;

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const userData = await User.findOne({ _id: decodedData?.id });

    if (userData.activeToken && userData.activeToken === token) {
      const user = await User.findOneAndUpdate(
        { _id: decodedData.id, activeToken: token },
        { $unset: { activeToken: "" }, lastLogout: Date.now() },
        { new: true }
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid session or token, please login again",
        });
      }

      return res.status(200).json({
        success: true,
        message: `${userData.fullname} is Logout Successfully`,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Token expired, please login again" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired, please login again" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    } else {
      console.error("Other error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `${email} this email is not registered`,
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:4000/auth/reset-password/${resetToken}`;

    const message = `
    <!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
        }
        .header {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 10px;
            border-top: 1px solid #e0e0e0;
            border-radius: 0 0 5px 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Hello ${user.fullname},</h2>
        </div>
        <div class="content">
            <p>We have received a request to reset your password for your account on <strong>Event Panel</strong>. If you did not request this change, you can ignore this email and your password will not be changed.</p>
            
            <p>To reset your password, please click on the following link and follow the instructions:</p>
            
            <p><a class="button" href="${resetUrl}">Reset Password</a></p>
            
            <p>This link will expire in <strong>15 minutes</strong> for security reasons. If you need to reset your password after this time, please make another request.</p>
        </div>
        <div class="footer">
            <h3>Thank you,</h3>
            <h3>Event Team </h3>
        </div>
    </div>
</body>
</html>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Account Password Reset Link",
        text: message,
      });

      return res.status(200).json({
        success: true,
        data: "Password Reset Email Sent Successfully",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return res
        .status(500)
        .json({ success: false, error: "Email could not be sent" });
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      passwordResetToken: req.params.resetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Reset Token" });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, data: "Password Reset Successfully" });
  } catch (error) {
    next(error);
  }
};

exports.verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    const decodedData = verifyToken(token);
    // console.log(decodedData);
    if (!decodedData) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const { email } = decodedData;

    const LoggedUser = await User.findOne({
      email: email,
      activeToken: token,
    }).select("-password -activeToken");

    if (!LoggedUser) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    return res.status(200).json({
      success: true,
      data: LoggedUser,
      message: "Verification Successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.updatedUser = async (req, res) => {
  const { id } = req.params; // Removing unnecessary property access
  validateMongoDbId(id);
  if (req.body?.mobile) {
    // Check if the mobile number exists for another user
    const existingUserWithMobile = await User.findOne({
      mobile: req.body.mobile,
      _id: { $ne: id }, // Exclude the current user from the check
    });

    if (existingUserWithMobile) {
      return res.status(400).json({
        success: false,
        error: "User with this contact number already exists.",
      });
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        fullname: req?.body?.fullname,
        // lastname: req.body.lastname,
        // email: req?.body?.email,
        mobile: req?.body?.mobile,
        profilePicture: req?.body?.profilePicture,
        age: req?.body?.age,
        university: req?.body?.university,
        gender: req?.body?.gender,
        eatPrefer: req?.body?.eatPrefer,
        smoke_drinkPrefer: req?.body?.smoke_drinkPrefer,
        PetPrefer: req?.body?.PetPrefer,
        provinces: req?.body?.provinces,
        isBlocked: req?.body?.isBlocked,
        ageGroup: req?.body?.ageGroup,
        genderPrefer: req?.body?.genderPrefer,
        dateOfbirth: req?.body?.dateOfbirth,
        collegeName: req?.body?.collegeName,
        collegeProgram: req?.body?.collegeProgram,
        preference: req?.body?.preference,
        roomMateBio: req?.body?.roomMateBio,
        spokenLanguage: req?.body?.spokenLanguage,
        country: req?.body?.country,
        city: req?.body?.city,
        step: req?.body?.step,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    if (updatedUser.isBlocked) {
      // Find properties associated with the blocked user
      const propertiesToUpdate = await Property.find({
        userId: updatedUser._id,
      });

      // Update the status of each property
      await Promise.all(
        propertiesToUpdate.map(async (property) => {
          property.isBlocked = true; // Assuming you have a field isBlocked in your Property schema
          await property.save();
        })
      );
    }
    if (!updatedUser.isBlocked) {
      // Find properties associated with the blocked user
      const propertiesToUpdate = await Property.find({
        userId: updatedUser._id,
      });

      // Update the status of each property
      await Promise.all(
        propertiesToUpdate.map(async (property) => {
          property.isBlocked = false; // Assuming you have a field isBlocked in your Property schema
          await property.save();
        })
      );
    }

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const searchQuery = req.query.search;

    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    // const userQuery = User.find();
    //not including admin role
    let userQuery = User.find({ role: { $ne: "admin" } })
      .populate("wishlist")
      .populate("preference");
    if (searchQuery) {
      userQuery.or([
        { fullname: { $regex: new RegExp(searchQuery, "i") } },
        // { lastname: { $regex: new RegExp(searchQuery, "i") } },
        { email: { $regex: new RegExp(searchQuery, "i") } },
        { mobile: { $regex: new RegExp(searchQuery, "i") } },
      ]);
    }

    const totalItems = await User.countDocuments(userQuery);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const skip = (currentPage - 1) * itemsPerPage;
    const users = await userQuery
      .sort({ fullname: 1 })
      .skip(skip)
      .limit(itemsPerPage)
      .exec();
    if (!users) {
      return res.status(404).json({
        success: false,
        error: "Data not found",
      });
    }
    return res.status(200).json({
      success: true,
      totalItems,
      totalPages,
      currentPage,
      users,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

exports.getaUser = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id); // Ensure this throws an error if ID is invalid

  try {
    const getaUser = await User.findById(_id)
      .populate("preference")
      .populate("wishlist");

    if (!getaUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // const idsToLookup = {
    //   universities: user.university ? [user.university] : [],
    //   provinces: user.provinces ? [user.provinces] : [],
    //   cities: user.city ? [user.city] : [],
    // };

    // const [universityData, stateData, cityData] = await Promise.all([
    //   College.find({ _id: { $in: idsToLookup.universities } }),
    //   State.find({ _id: { $in: idsToLookup.provinces } }),
    //   City.find({ _id: { $in: idsToLookup.cities } }),
    // ]);

    let universityData = null;
    let stateData = null;
    let cityData = null;
    if (getaUser.university) {
      universityData = await College.findById(getaUser.university);
    }
    if (getaUser.provinces) {
      stateData = await State.findById(getaUser.provinces);
    }
    if (getaUser.city) {
      cityData = await City.findById(getaUser.city);
    }


   let unread = 0
    const conversations = await Conversation.find({ participants: _id })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "senderId", select: "fullname" },
          { path: "receiverId", select: "fullname" },
        ],
      })
      .populate("participants", "fullname profilePicture")
      .populate("propertyId", "title")
      .sort({ updatedAt: -1 });

    const inbox = conversations.map((conv) => {
      const lastMessage = conv.messages[0]
        ? conv.messages[0].message
        : "No messages";
      const otherParticipant = conv.participants.find(
        (participant) => !participant._id.equals(_id)
      );
      const unreadCount = conv.messages.reduce((count, msg) => {
        return msg.senderId.toString() !== _id.toString() && !msg.isRead
          ? count + 1
          : count;
      }, 0);
       unread += unreadCount
      return {
        lastMessage,
        otherParticipant,
        unreadCount,
      };
    });

    res.status(200).json({
      success: true,
      getaUser,
      universityData,
      stateData,
      cityData,
      inbox,
      unread

    });
  } catch (error) {
    console.error("Error in getaUser controller: ", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  const _id = req.params.id;
  validateMongoDbId(_id);

  try {
    const user = await User.findById(_id).populate("wishlist").populate("city").populate("provinces");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    // Find and delete properties associated with the user
    const deletedProperties = await Property.deleteMany({ userId: id });
    return res.status(200).json({ success: true, deletedUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user; // Remove unnecessary property access

    const user = await User.findById(_id).select("+password");
    // Verify the current password
    const isPasswordMatch = await user.matchPasswords(oldPassword);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Current password is incorrect" });
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Password change failed" });
  }
};
exports.updateAdminEmail = async (req, res) => {
  const { oldMail, newMail } = req.body;
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);

    if (newMail === oldMail) {
      return res.status(401).json({
        success: false,
        error: "Old and new email address cannot be same.",
      });
    }
    const existingUser = await User.findOne({ email: newMail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "The new email address is already in use.",
      });
    }
    // Verify the old email
    if (user.email !== oldMail) {
      return res
        .status(401)
        .json({ success: false, error: "Current email is incorrect" });
    }

    // Update the email
    user.email = newMail;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Email update failed" });
  }
};

exports.graphData = async (req, res) => {
  try {
    let currentDate = req.query.date ? new Date(req.query.date) : new Date();
    if (isNaN(currentDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const currentMonth = currentDate.getMonth();

    const totalCounts = {};

    const propertyCount = await Property.countDocuments();
    totalCounts.totalProperties = propertyCount;

    const userIds = await Property.distinct("userId");
    const usersWithoutPropertyCount = await User.countDocuments({
      _id: { $nin: userIds },
      role: "user",
    });
    totalCounts.usersWithoutProperty = usersWithoutPropertyCount;

    const currentDateLoginCount = await User.countDocuments({
      role: "user",
      lastLogin: {
        $gte: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        ),
        $lt: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1
        ),
      },
    });
    totalCounts.currentDateLoginUsers = currentDateLoginCount;

    const currentMonthLoginCount = await User.countDocuments({
      lastLogin: {
        $gte: new Date(currentDate.getFullYear(), currentMonth, 1),
        $lt: new Date(currentDate.getFullYear(), currentMonth + 1, 1),
      },
      role: "user",
    });
    totalCounts.currentMonthLoginUsers = currentMonthLoginCount;

    const genderCounts = await User.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]);
    totalCounts.genderCounts = genderCounts;

    const cityCounts = await User.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: "$city", count: { $sum: 1 } } },
    ]);
    totalCounts.cityCounts = cityCounts;

    const sevenDaysInactiveCount = await User.countDocuments({
      lastLogin: {
        $lt: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 7
        ),
      },
      role: "user",
    });
    totalCounts.sevenDaysInactiveUsers = sevenDaysInactiveCount;

    const thirtyDaysInactiveCount = await User.countDocuments({
      lastLogin: {
        $lt: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 30
        ),
      },
      role: "user",
    });
    totalCounts.thirtyDaysInactiveUsers = thirtyDaysInactiveCount;

    // Total count of new users registered today
    const newUsersTodayCount = await User.countDocuments({
      createdAt: {
        $gte: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        ),
        $lt: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1
        ),
      },
      role: "user",
    });
    totalCounts.newUsersToday = newUsersTodayCount;

    const preferenceCounts = await User.aggregate([
      { $unwind: "$preference" },
      { $match: { role: "user" } },
      { $group: { _id: "$preference", count: { $sum: 1 } } },
    ]).exec();

    const populatedPreferenceCounts = await Preference.populate(
      preferenceCounts,
      { path: "_id", select: "preference" }
    );

    totalCounts.preferenceCounts = populatedPreferenceCounts;
    res.json(totalCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.userData = async (req, res) => {
  try {
    let users = [];

    var invitationData = await User.find({});

    invitationData.forEach((user) => {
      const {
        fullname,
        email,
        contact,
        dateOfbirth,
        collegeName,
        collegeProgram,
        age,
        university,
        country,
        city,
        spokenLanguage,
        ageGroup,
        gender,
        genderPrefer,
        lastLogin,
      } = user;
      users.push({
        fullname,
        email,
        contact,
        dateOfbirth,
        collegeName,
        collegeProgram,
        age,
        university,
        country,
        city,
        spokenLanguage,
        ageGroup,
        gender,
        genderPrefer,
        lastLogin,
      });
    });
    const fields = [
      "fullname",
      "email",
      "contact",
      "dateOfbirth",
      "collegeName",
      "collegeProgram",
      "age",
      "university",
      "country",
      "city",
      "spokenLanguage",
      "ageGroup",
      "gender",
      "genderPrefer",
      "lastLogin",
    ];
    const csvParser = new CsvParser({ fields });
    const data = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment: filename=UserData.csv");

    res.status(200).end(data);
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};


exports.getaUser_ById = async (req, res) => {
  const { id } = req.query;
  validateMongoDbId(id);

  try {
    // Find user by ID and exclude sensitive fields
    const getaUser = await User.findById(id).select("-password -activeToken");

    if (!getaUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.json({
      status: true,
      message: "Get data successfully",
      data: getaUser
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


exports.deleteUser_by_email = async (req, res) => {
  const { email } = req.params; // Assuming the user's email is securely obtained from the authenticated session

  try {
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Attempt to delete the user by email
    const deletedUser = await User.findOneAndDelete({ email });

    // Check if a user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Respond to the client upon successful deletion
    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    // Handle possible errors during the deletion process
    return res.status(500).json({
      success: false,
      message: "Server error occurred while deleting the user.",
      error: error.message,
    });
  }
};

// Function to validate email format
function isValidEmail(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}