import { Router } from "express";
import { postController } from "../controllers/post.controller.js";
import { requireAuth } from "../middlewares/token.js";
import { upload } from "../middlewares/uploadMiddleware.js";

export const postRouter = Router();

postRouter.post(
    '/upload',
    [
        requireAuth,
        upload.single('image')
    ],
    postController.createPost
)

postRouter.get('/feed', requireAuth, postController.getAllPosts)

postRouter.get('/mine', requireAuth, postController.getMyPosts);