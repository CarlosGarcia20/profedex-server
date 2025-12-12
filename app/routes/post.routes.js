import { Router } from "express";
import { postController } from "../controllers/post.controller.js";
import { requireAuth } from "../middlewares/token.js";
import { upload, uploadProfile } from "../middlewares/uploadMiddleware.js";

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

postRouter.patch(
    '/profile-picture', 
    [
        requireAuth,
        uploadProfile.single('avatar')
    ], 
    postController.uploadProfilePicture
)

postRouter.get('/events', requireAuth, postController.getAllActiveEvents)
postRouter.delete('/me/images/:imageId', requireAuth, postController.deleteUserImage)