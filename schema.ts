import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /**
   * Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user.
   * This mirrors the Manus account and should be used for authentication lookups.
   */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  dateOfBirth: timestamp("dateOfBirth"),
  address: text("address"),
  emergencyContact: varchar("emergencyContact", { length: 20 }),
  skillLevel: mysqlEnum("skillLevel", ["beginner", "intermediate", "advanced"]).default("beginner"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Swimming Sessions Table
export const swimmingSessions = mysqlTable("swimmingSessions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  instructorName: varchar("instructorName", { length: 255 }).notNull(),
  skillLevel: mysqlEnum("skillLevel", ["beginner", "intermediate", "advanced"]).notNull(),
  maxParticipants: int("maxParticipants").notNull(),
  currentParticipants: int("currentParticipants").default(0).notNull(),
  sessionDate: timestamp("sessionDate").notNull(),
  duration: int("duration").notNull(), // in minutes
  location: varchar("location", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["scheduled", "ongoing", "completed", "cancelled"]).default("scheduled").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SwimmingSession = typeof swimmingSessions.$inferSelect;
export type InsertSwimmingSession = typeof swimmingSessions.$inferInsert;

// Session Bookings Table
export const sessionBookings = mysqlTable("sessionBookings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sessionId: int("sessionId").notNull(),
  bookingStatus: mysqlEnum("bookingStatus", ["confirmed", "pending", "cancelled"]).default("confirmed").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["paid", "pending", "refunded"]).default("pending").notNull(),
  bookingDate: timestamp("bookingDate").defaultNow().notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SessionBooking = typeof sessionBookings.$inferSelect;
export type InsertSessionBooking = typeof sessionBookings.$inferInsert;

// Blog Posts Table
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: varchar("featuredImage", { length: 500 }),
  category: varchar("category", { length: 100 }).notNull(),
  tags: text("tags"), // JSON string array
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Blog Comments Table
export const blogComments = mysqlTable("blogComments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  parentCommentId: int("parentCommentId"), // For nested comments
  status: mysqlEnum("status", ["approved", "pending", "spam"]).default("approved").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = typeof blogComments.$inferInsert;

// Product Categories Table
export const productCategories = mysqlTable("productCategories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  parentCategoryId: int("parentCategoryId"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = typeof productCategories.$inferInsert;

// Products Table (E-commerce)
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("shortDescription"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compareAtPrice", { precision: 10, scale: 2 }),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  stockQuantity: int("stockQuantity").default(0).notNull(),
  images: text("images"), // JSON string array of image URLs
  sizes: text("sizes"), // JSON string array
  colors: text("colors"), // JSON string array
  brand: varchar("brand", { length: 100 }),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  dimensions: varchar("dimensions", { length: 100 }),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  status: mysqlEnum("status", ["active", "inactive", "out_of_stock"]).default("active").notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Shopping Cart Table
export const shoppingCarts = mysqlTable("shoppingCarts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShoppingCart = typeof shoppingCarts.$inferSelect;
export type InsertShoppingCart = typeof shoppingCarts.$inferInsert;

// Cart Items Table
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  cartId: int("cartId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  selectedSize: varchar("selectedSize", { length: 50 }),
  selectedColor: varchar("selectedColor", { length: 50 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

// Orders Table
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0").notNull(),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  shippingAddress: text("shippingAddress").notNull(),
  billingAddress: text("billingAddress").notNull(),
  trackingNumber: varchar("trackingNumber", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Order Items Table
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  selectedSize: varchar("selectedSize", { length: 50 }),
  selectedColor: varchar("selectedColor", { length: 50 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// Likes Table (for blog posts and products)
export const likes = mysqlTable("likes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entityType: mysqlEnum("entityType", ["blog_post", "product", "comment"]).notNull(),
  entityId: int("entityId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Like = typeof likes.$inferSelect;
export type InsertLike = typeof likes.$inferInsert;

// Product Reviews Table
export const productReviews = mysqlTable("productReviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["approved", "pending", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = typeof productReviews.$inferInsert;

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  sessionBookings: many(sessionBookings),
  blogPosts: many(blogPosts),
  blogComments: many(blogComments),
  shoppingCarts: many(shoppingCarts),
  orders: many(orders),
  likes: many(likes),
  productReviews: many(productReviews),
}));

export const swimmingSessionsRelations = relations(swimmingSessions, ({ many }) => ({
  bookings: many(sessionBookings),
}));

export const sessionBookingsRelations = relations(sessionBookings, ({ one }) => ({
  user: one(users, {
    fields: [sessionBookings.userId],
    references: [users.id],
  }),
  session: one(swimmingSessions, {
    fields: [sessionBookings.sessionId],
    references: [swimmingSessions.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  comments: many(blogComments),
  likes: many(likes),
}));

export const blogCommentsRelations = relations(blogComments, ({ one, many }) => ({
  post: one(blogPosts, {
    fields: [blogComments.postId],
    references: [blogPosts.id],
  }),
  user: one(users, {
    fields: [blogComments.userId],
    references: [users.id],
  }),
  parentComment: one(blogComments, {
    fields: [blogComments.parentCommentId],
    references: [blogComments.id],
  }),
  replies: many(blogComments),
  likes: many(likes),
}));

export const productCategoriesRelations = relations(productCategories, ({ one, many }) => ({
  products: many(products),
  parentCategory: one(productCategories, {
    fields: [productCategories.parentCategoryId],
    references: [productCategories.id],
  }),
  subCategories: many(productCategories),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  likes: many(likes),
  reviews: many(productReviews),
}));

export const shoppingCartsRelations = relations(shoppingCarts, ({ one, many }) => ({
  user: one(users, {
    fields: [shoppingCarts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(shoppingCarts, {
    fields: [cartItems.cartId],
    references: [shoppingCarts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
}));

