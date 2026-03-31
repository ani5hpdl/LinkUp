import z from "zod";

export const createPostSchema = z.object({
    content: z.string()
        .min(1,{message: "Content is Required."})
        .max(225,{message: "Content must not exceed 225 characters."}),

    imageUrl: z.string()
        .optional()

});

export const updatePostSchema = z.object({
    content: z.string()
        .min(1,{message: "Content must be required"})
        .max(225,{message: "Content must not exceed 225 characters."})
        .optional(),

    imageUrl: z.string()
        .optional()    
});

export const createCommentSchema = z.object({
    content: z.string()
        .min(1,{message: "Comment must be required"})
        .max(225,{message: "Comment must not exceed 225 characters."})
});

export type PostData = z.infer<typeof createPostSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;