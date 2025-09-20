const Wishlist = require("../models/wishlistModel");
const User = require("../models/authModel");

const add_to_wishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if item already exists in wishlist
    const existingWishItem = await Wishlist.findOne({
      id: req.body.id,
      userId,
    });

    if (existingWishItem) {
      return res.status(409).send({
        success: false,
        message: "Item already exists in the wishlist",
      });
    }

    // Create new wishlist item
    const wishlist_obj = new Wishlist({
      userId,
      id: req.body.id,
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      rating: req.body.rating,
      duration: req.body.duration,
      lectures: req.body.lectures,
      price: req.body.price,
      image: req.body.image,
    });

    const wishlistData = await wishlist_obj.save();

    // Push wishlist reference to User model
    await User.findByIdAndUpdate(
      userId,
      { $push: { wishlist: wishlistData._id } },  // <-- User model must have 'wishlist' field as ObjectId[]
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Wishlist item added successfully",
      data: wishlistData,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

const get_wishlist_items = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("wishlist");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Wishlist items retrieved successfully",
      data: user.wishlist,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

const delete_wishlist_item = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.id;

    // Step 1: Delete the wishlist item (and ensure it belongs to this user)
    const deletedItem = await Wishlist.findOneAndDelete({
      _id: itemId,
      userId,
    });

    if (!deletedItem) {
      return res.status(404).send({
        success: false,
        message: "Item not found or unauthorized",
      });
    }

    // ✅ Step 2: Remove the reference from the user's `wishlist` array
    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: itemId }
    });

    res.status(200).send({
      success: true,
      message: "Item deleted from wishlist",
      data: deletedItem,
    });
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while deleting the wishlist item",
    });
  }
};


module.exports = {
  add_to_wishlist,
  get_wishlist_items,
  delete_wishlist_item
};
