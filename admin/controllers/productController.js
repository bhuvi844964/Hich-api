import multer from "multer";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { paginationOptions } from "../../utils/paginationOptions.js";
import {uploadImage , upload} from "../middlewares/azureStorage.js"
// Configure multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// Create a new product
export const createProduct = async (req, res) => {
  const {
    nameInHindi,
    nameInEnglish,
    descriptionInHindi,
    descriptionInEnglish,
  } = req.body;

  try {

    const image = req.file;
    const imageUrl = await uploadImage(image);
    // Create the product in the database
    const product = await Product.create({
      nameInHindi,
      nameInEnglish,
      image: imageUrl,
      descriptionInHindi,
      descriptionInEnglish,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.log("ERROR::", error.message);
    res.status(500).json({ message: "Failed to create product" });
  }
};
try {
  
} catch (error) {
  console.error('An error occurred:', error);
  res.status(500).json({ message: 'Failed to create product' });
}

const hindiLanguageFields = [
  "nameInHindi",
  "descriptionInHindi",
  "image",
];
const englishLanguageFields = [
  "nameInEnglish",
  "descriptionInEnglish",
  "image",
];

try {
  
} catch (error) {
  console.log(error);
  
}

// Get all products
export const getAllProducts = async (req, res) => {
  const { limit, page, sortBy, searchValue } = req.query;
  let currentPage = searchValue ? 1 : page;
  try {
    const user = await User.findById(req.userId);
    const selectedFields = user.isEnglish
      ? englishLanguageFields
      : hindiLanguageFields;
    const selectOption = selectedFields.join(" ");
    const options = {
      page: currentPage || 1,
      limit: limit || 10,
      sort: { createdAt: -1 },
    };
    if (req.role === "admin") {
      delete options.select;
    } else {
      options.select = selectOption;
    }
    let query = { deleted: false };
    if (searchValue) {
      query.$or = [
        { nameInHindi: { $regex: searchValue, $options: "i" } },
        { nameInEnglish: { $regex: searchValue, $options: "i" } },
      ];
      //query.name = { $regex: searchValue, $options: "i" };
    }

    const products = await Product.paginate(query, options);
    // const products = await Product.find().select(
    //   req.language === "en"
    //     ? englishLanguageFields.join(" ")
    //     : hindiLanguageFields.join(" ")
    // );
    // Convert binary image to Base64 string
    const productsWithBase64Image = products.docs.map((product) => {
      const base64Image = product.image

      return {
        ...product.toObject(),
        base64Image,
      };
    });
    const response = {
      success: true,
      data: {
        docs: productsWithBase64Image,
        totalDocs: products.totalDocs,
        limit: products.limit,
        totalPages: products.totalPages,
        page: products.page,
        pagingCounter: products.pagingCounter,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
      },
    };

   return res.status(200).json(response);

    //res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve products" });
  }
};

// Get a specific product by ID
export const getProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      ...product.toObject(),
      image: product.image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve product" });
  }
};

// Update a product by ID
export const updateProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const {
      nameInHindi,
      nameInEnglish,
      descriptionInHindi,
      descriptionInEnglish,
    } = req.body;
    const image = req.file;
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the image if provided
    if (image) {
      const imageUrl = await uploadImage(image);
      product.image = imageUrl;
    }

    // Update product fields
    product.nameInHindi = nameInHindi || product.nameInHindi;
    product.nameInEnglish = nameInEnglish || product.nameInEnglish;
    product.descriptionInHindi =
      descriptionInHindi || product.descriptionInHindi;
    product.descriptionInEnglish =
      descriptionInEnglish || product.descriptionInEnglish;
    

    // Save the updated product
    const updatedProduct = await product.save();

    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete a product by ID
export const deleteProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.softDelete();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the product" });
  }
};

export const getProductCount = async (req, res) => {
  try {
    // Get the count of products with delete: false
    const count = await Product.countDocuments({ deleted: false });

    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Middleware for handling file upload
export const uploadImageData = upload.single("image");
