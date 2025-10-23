import express from 'express'
import { Login, Register } from '../controller/userController.js'
import { protectedRoute } from '../middleware/userMiddleware.js'
import { addCategory, getCategories } from '../controller/categoryController.js'
import { addSubCategory, getSubCategories } from '../controller/subCategoryController.js'
import upload from '../middleware/multer.js'
import { addProduct, getProductDetails, getProducts, updateProduct } from '../controller/ProductController.js'

const router = express.Router()


router.post('/register', Register)
router.post('/login', Login)

router.post("/addCategory", protectedRoute, addCategory);
router.get("/getCategories", protectedRoute, getCategories);


router.post("/addSubcategory", protectedRoute, addSubCategory);
router.get("/subcategories", protectedRoute, getSubCategories);

router.post("/addproduct", protectedRoute, upload.array("images", 5), addProduct);
router.get("/getproducts", protectedRoute, getProducts);
router.get("/productdetails/:id", protectedRoute, getProductDetails);
router.put("/updateproduct/:id", protectedRoute, upload.array("images", 5), updateProduct);

export default router