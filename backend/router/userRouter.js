import express from 'express'
import { Login, Register } from '../controller/userController.js'
import { protectedRoute } from '../middleware/userMiddleware.js'
import { addCategory, getCategories } from '../controller/categoryController.js'
import { addSubCategory, getSubCategories } from '../controller/subCategoryController.js'
import upload from '../middleware/multer.js'
import { addProduct, getProducts, updateProduct } from '../controller/ProductController.js'

const router = express.Router()


router.post('/register', Register)
router.post('/login', Login)

router.post("/addCategory", protectedRoute, addCategory);
router.get("/categories", protectedRoute, getCategories);


router.post("/subcategory", protectedRoute, addSubCategory);
router.get("/subcategories", protectedRoute, getSubCategories);

router.post("/product", protectedRoute, upload.array("images", 5), addProduct);
router.get("/products", protectedRoute, getProducts);
router.put("/product/:id", protectedRoute, upload.array("images", 5), updateProduct);

export default router