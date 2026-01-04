'use server';

import { signIn, signOut, auth } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client"; 
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { z } from "zod";

// --- Authentication Actions ---

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get("email") as string;
    const expectedRole = formData.get("expectedRole") as string;

    // 1. Role Security Check: Verify Role in Database before signing in
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // SCENARIO A: User trying to login via Admin Form
        if (expectedRole === "ADMIN" && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
          return "Access Denied: You are a standard User. Please use the User Login.";
        }

        // SCENARIO B: Admin trying to login via User Form
        if (expectedRole === "USER" && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
          return "Access Denied: You are an Admin. Please use the Admin Login.";
        }
      }
    }

    // 2. Proceed with NextAuth Sign In
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function handleLogout() {
  await signOut({ redirectTo: "/login" });
}

// --- Product Actions ---

export async function deleteProduct(formData: FormData) {
  // 🔒 SECURITY: Check Role
  const session = await auth();
  const role = (session?.user as any)?.role;
  
  if (role === "USER") {
     throw new Error("Unauthorized: Users cannot delete products.");
  }

  const id = formData.get("id") as string;
  if (!id) return;

  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/dashboard/products");
  } catch (error) {
    console.error("Failed to delete product:", error);
  }
}

export async function createProduct(formData: FormData) {
  // 🔒 SECURITY: Check Role
  const session = await auth();
  const role = (session?.user as any)?.role;
  
  if (role === "USER") {
     throw new Error("Unauthorized: Users cannot create products.");
  }

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    images: formData.getAll("images") as string[], 
  };

  const validatedData = productSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error(validatedData.error);
    return;
  }

  try {
    await prisma.product.create({
      data: {
        ...validatedData.data,
        images: validatedData.data.images || [], 
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create product.");
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function updateProduct(id: string, formData: FormData) {
  // 🔒 SECURITY: Check Role
  const session = await auth();
  const role = (session?.user as any)?.role;
  
  if (role === "USER") {
     throw new Error("Unauthorized: Users cannot update products.");
  }

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    images: formData.getAll("images") as string[],
  };

  const validatedData = productSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error("Validation Failed:", validatedData.error);
    return;
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...validatedData.data,
        images: validatedData.data.images || [],
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update product.");
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

// --- Admin Management Actions ---

// Validation schema for creating an admin
const createAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]),
});

export async function createAdmin(formData: FormData) {
  // 1. Security Check: Verify the requester is a SUPER_ADMIN
  const session = await auth();
  
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    console.error("Unauthorized Access Attempt");
    return; 
  }

  // 2. Validate Input
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const validatedData = createAdminSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error("Validation Error:", validatedData.error);
    return; 
  }

  const { email, password, role } = validatedData.data;

  try {
    // 3. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error("User already exists");
      return; 
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create the new Admin
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        // Map string to Enum (e.g., "ADMIN" -> Role.ADMIN)
        role: role === "SUPER_ADMIN" ? Role.SUPER_ADMIN : Role.ADMIN,
      },
    });

    console.log(`New Admin created: ${email}`);

  } catch (error) {
    console.error("Database Error:", error);
    return; 
  }

  // 6. Refresh the page
  revalidatePath("/dashboard/admins");
  redirect("/dashboard/admins");
}

// --- Public Registration Action (Strictly USER only) ---

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validatedData = registerSchema.safeParse(rawData);

  if (!validatedData.success) {
    return "Invalid input data. Please check your details.";
  }

  const { email, password } = validatedData.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return "User already exists. Please login.";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔒 FORCE ROLE TO "USER" using the Prisma Enum
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.USER, // <--- Correct Usage
      },
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return "Something went wrong. Please try again.";
  }

  redirect("/login");
}

// ... (keep all your existing imports and code)

// --- User Management Actions ---

export async function deleteUser(formData: FormData) {
  // 1. Security Check: Only SUPER_ADMIN can delete users
  const session = await auth();
  const currentUserRole = (session?.user as any)?.role;
  const currentUserId = (session?.user as any)?.id; // Assuming you have ID in session
  
  if (currentUserRole !== "SUPER_ADMIN") {
     throw new Error("Unauthorized: Only Super Admins can delete users.");
  }

  const targetUserId = formData.get("id") as string;

  // 2. Safety Check: Prevent deleting yourself
  if (targetUserId === currentUserId) {
     // Ideally handle this gracefully, but for now we just return
     console.error("Cannot delete yourself.");
     return; 
  }

  try {
    await prisma.user.delete({
      where: { id: targetUserId },
    });
    revalidatePath("/dashboard/admins");
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw new Error("Failed to delete user.");
  }
}
