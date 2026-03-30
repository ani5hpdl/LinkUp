import { z } from 'zod';

// Register validation schema
export const registerSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(30, { message: 'Username cannot be longer than 30 characters' }),
    
  email: z.string()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email cannot be longer than 255 characters' }),

  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(255, { message: 'Password cannot be longer than 255 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[\W_]/, { message: 'Password must contain at least one special character' }),

  // Optional fields that you might want to include
  displayName: z.string()
    .max(60, { message: 'Display name cannot be longer than 60 characters' })

});

// Login validation schema
export const loginSchema = z.object({
  email: z.string()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email cannot be longer than 255 characters' }),

  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(255, { message: 'Password cannot be longer than 255 characters' })
});

export const updateMeSchema = z.object({
  displayName: z.string()
    .min(1,{message : "Display Name must be more than 1 letter."})
    .max(60, { message: 'Display name cannot be longer than 60 characters' })
    .optional(),

  bio: z.string()
    .min(1,{message : "Bio must be more than 1 letter."})
    .max(225, { message: 'Bio cannot be longer than 225 characters' })
    .optional(),

  avatar_url: z.string()
    .optional()
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type UpdateMeData = z.infer<typeof updateMeSchema>;