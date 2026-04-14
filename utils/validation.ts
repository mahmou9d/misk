import * as z from "zod";

export const getSignupSchema = (locale: string) => {
  const isAr = locale === "ar";
  return z
    .object({
      full_name: z
        .string()
        .min(
          2,
          isAr
            ? "يجب أن يكون الاسم حرفين على الأقل"
            : "Name must be at least 2 characters",
        )
        .max(50, isAr ? "الاسم طويل جداً" : "Name is too long"),
      email: z
        .string()
        .email(isAr ? "البريد الإلكتروني غير صالح" : "Invalid email address")
        .min(1, isAr ? "البريد الإلكتروني مطلوب" : "Email is required"),
      password1: z
        .string()
        .min(
          8,
          isAr
            ? "يجب أن تكون كلمة المرور 8 أحرف على الأقل"
            : "Password must be at least 8 characters",
        )
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          isAr
            ? "يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة وأرقام"
            : "Password must contain uppercase, lowercase, and numbers",
        ),
      password2: z
        .string()
        .min(
          1,
          isAr ? "يرجى تأكيد كلمة المرور" : "Please confirm your password",
        ),
    })
    .refine((data) => data.password1 === data.password2, {
      message: isAr ? "كلمات المرور غير متطابقة" : "Passwords do not match",
      path: ["password2"],
    });
};

export const getLoginSchema = (locale: string) => {
  const isAr = locale === "ar";
  return z.object({
    email: z
      .string()
      .min(1, isAr ? "البريد الإلكتروني مطلوب" : "Email is required")
      .email(isAr ? "البريد الإلكتروني غير صالح" : "Invalid email address"),
    password: z
      .string()
      .min(
        6,
        isAr
          ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل"
          : "Password must be at least 6 characters",
      ),
    rememberMe: z.boolean().optional(),
  });
};

export const getResetPasswordSchema = (locale: string) => {
  const isAr = locale === "ar";
  return z
    .object({
      password: z
        .string()
        .min(
          8,
          isAr
            ? "يجب أن تكون كلمة المرور 8 أحرف على الأقل"
            : "Password must be at least 8 characters",
        )
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          isAr
            ? "يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة وأرقام"
            : "Password must contain uppercase, lowercase, and numbers",
        ),
      confirmPassword: z
        .string()
        .min(
          1,
          isAr ? "يرجى تأكيد كلمة المرور" : "Please confirm your password",
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: isAr ? "كلمات المرور غير متطابقة" : "Passwords do not match",
      path: ["confirmPassword"],
    });
};

export const getForgotPasswordSchema = (locale: string) => {
  const isAr = locale === "ar";
  return z.object({
    email: z
      .string()
      .email(isAr ? "البريد الإلكتروني غير صالح" : "Invalid email address")
      .min(1, isAr ? "البريد الإلكتروني مطلوب" : "Email is required"),
  });
};

// ── Schema ──────────────────────────────────────────────────────────────────
export const getCheckoutSchema = (locale: string) => {
  const isAr = locale === "ar";
  return z.object({
    
    firstName: z
      .string()
      .min(1, isAr ? "الاسم الأول مطلوب" : "First name is required"),
    lastName: z
      .string()
      .min(1, isAr ? "اسم العائلة مطلوب" : "Last name is required"),
    guest_email: z
      .string()
      .min(1, isAr ? "البريد الإلكتروني مطلوب" : "Email is required")
      .email(isAr ? "البريد الإلكتروني غير صالح" : "Invalid email address"),
    address: z.string().min(1, isAr ? "العنوان مطلوب" : "Address is required"),
    apt: z.string().optional(),
    city: z.string().min(1, isAr ? "المدينة مطلوبة" : "City is required"),
    governorate_id: z
      .string()
      .min(1, isAr ? "المحافظة مطلوبة" : "Governorate is required"),
    
    phone: z
      .string()
      .min(
        8,
        isAr ? "يرجى إدخال رقم هاتف صالح" : "Please enter a valid phone number",
      ),
    
    payment_method: z.enum(["cod", "paymob"]),
    billing: z.enum(["same", "different"]),
  });
};
