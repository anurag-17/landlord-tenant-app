const Property = require("../models/Property");


exports.addReview = async (req, res) => {
  const { prodId, star, comment } = req.body;
  const _id = req.user._id;
  console.log();
  try {
    const product = await Property.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => 
    //   console.log(userId.postedby.toString() === _id.toString())
      userId.postedby.toString() === _id.toString()
      );
    //   console.log(alreadyRated);
    //   return
    if (alreadyRated) {
      const updateRating = await Property.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Property.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Property.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
      let actualRating = (ratingsum / totalRating).toFixed(1)
    let finalproduct = await Property.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Review added successfully",
      property: finalproduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};


exports.deleteReview = async (req, res) => {
    const { prodId, _id } = req.body;
    // const userId = req.user._id; // Assuming you have the user ID stored in req.user._id
  
    try {
      // Find the product by ID
      const product = await Property.findById(prodId);
  
      // Check if the review exists and belongs to the current user
      const reviewIndex = product.ratings.findIndex(review => review._id.toString() === _id.toString());
  
      if (reviewIndex === -1) {
        return res.status(404).json({ success: false, message: 'Review not found or you are not authorized to delete this review' });
      }
  
      // Remove the review from the ratings array
      product.ratings.splice(reviewIndex, 1);
  
      // Update total rating
      const totalRating = product.ratings.length;
      const ratingSum = product.ratings.reduce((sum, rating) => sum + rating.star, 0);
      const actualRating = totalRating > 0 ? Math.round(ratingSum / totalRating) : 0;
  
      // Update the total rating of the product
      product.totalrating = actualRating;
  
      // Save the updated product
      const updatedProduct = await product.save();
  
      return res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
        property: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  };
  
  exports.deleteReviewByUser = async (req, res) => {
    const { prodId } = req.body;
    const userId = req.user._id; // Assuming you have the user ID stored in req.user._id
  
    try {
      // Find the product by ID
      const product = await Property.findById(prodId);
  
      // Check if the review exists and belongs to the current user
      const reviewIndex = product.ratings.findIndex(review => review.postedby.toString() === userId.toString());
  
      if (reviewIndex === -1) {
        return res.status(404).json({ success: false, message: 'Review not found or you are not authorized to delete this review' });
      }
  
      // Remove the review from the ratings array
      product.ratings.splice(reviewIndex, 1);
  
      // Update total rating
      const totalRating = product.ratings.length;
      const ratingSum = product.ratings.reduce((sum, rating) => sum + rating.star, 0);
      const actualRating = totalRating > 0 ? Math.round(ratingSum / totalRating) : 0;
  
      // Update the total rating of the product
      product.totalrating = actualRating;
  
      // Save the updated product
      const updatedProduct = await product.save();
  
      return res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
        property: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  };