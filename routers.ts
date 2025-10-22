import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { db } from "./db";
import { 
  users, 
  swimmingSessions, 
  sessionBookings, 
  blogPosts, 
  blogComments, 
  products, 
  productCategories,
  shoppingCarts,
  cartItems,
  orders,
  orderItems,
  likes,
  productReviews
} from "../drizzle/schema";
import { eq, and, desc, sql, like } from "drizzle-orm";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User Profile Management
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id));
      return user;
    }),
    
    update: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
        dateOfBirth: z.string().optional(),
        address: z.string().optional(),
        emergencyContact: z.string().optional(),
        skillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.update(users)
          .set({
            ...input,
            dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.user.id));
        return { success: true };
      }),
  }),

  // Swimming Sessions
  sessions: router({
    list: publicProcedure
      .input(z.object({
        skillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        status: z.enum(["scheduled", "ongoing", "completed", "cancelled"]).optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        let query = db.select().from(swimmingSessions);
        
        const conditions = [];
        if (input.skillLevel) {
          conditions.push(eq(swimmingSessions.skillLevel, input.skillLevel));
        }
        if (input.status) {
          conditions.push(eq(swimmingSessions.status, input.status));
        }
        
        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }
        
        const sessions = await query
          .orderBy(desc(swimmingSessions.sessionDate))
          .limit(input.limit)
          .offset(input.offset);
        
        return sessions;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const [session] = await db.select().from(swimmingSessions).where(eq(swimmingSessions.id, input.id));
        return session;
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        instructorName: z.string(),
        skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
        maxParticipants: z.number(),
        sessionDate: z.string(),
        duration: z.number(),
        location: z.string(),
        price: z.string(),
      }))
      .mutation(async ({ input }) => {
        const [session] = await db.insert(swimmingSessions).values({
          ...input,
          sessionDate: new Date(input.sessionDate),
          currentParticipants: 0,
          status: "scheduled",
        });
        return { success: true, id: session.insertId };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        instructorName: z.string().optional(),
        skillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        maxParticipants: z.number().optional(),
        sessionDate: z.string().optional(),
        duration: z.number().optional(),
        location: z.string().optional(),
        price: z.string().optional(),
        status: z.enum(["scheduled", "ongoing", "completed", "cancelled"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.update(swimmingSessions)
          .set({
            ...data,
            sessionDate: data.sessionDate ? new Date(data.sessionDate) : undefined,
            updatedAt: new Date(),
          })
          .where(eq(swimmingSessions.id, id));
        return { success: true };
      }),
  }),

  // Session Bookings
  bookings: router({
    myBookings: protectedProcedure.query(async ({ ctx }) => {
      const bookings = await db
        .select({
          booking: sessionBookings,
          session: swimmingSessions,
        })
        .from(sessionBookings)
        .leftJoin(swimmingSessions, eq(sessionBookings.sessionId, swimmingSessions.id))
        .where(eq(sessionBookings.userId, ctx.user.id))
        .orderBy(desc(sessionBookings.createdAt));
      return bookings;
    }),

    create: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if session is available
        const [session] = await db.select().from(swimmingSessions).where(eq(swimmingSessions.id, input.sessionId));
        
        if (!session) {
          throw new Error("Session not found");
        }
        
        if (session.currentParticipants >= session.maxParticipants) {
          throw new Error("Session is full");
        }

        // Create booking
        const [booking] = await db.insert(sessionBookings).values({
          userId: ctx.user.id,
          sessionId: input.sessionId,
          notes: input.notes,
          bookingStatus: "confirmed",
          paymentStatus: "pending",
        });

        // Update session participant count
        await db.update(swimmingSessions)
          .set({
            currentParticipants: sql`${swimmingSessions.currentParticipants} + 1`,
          })
          .where(eq(swimmingSessions.id, input.sessionId));

        return { success: true, id: booking.insertId };
      }),

    cancel: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const [booking] = await db.select().from(sessionBookings).where(
          and(
            eq(sessionBookings.id, input.id),
            eq(sessionBookings.userId, ctx.user.id)
          )
        );

        if (!booking) {
          throw new Error("Booking not found");
        }

        await db.update(sessionBookings)
          .set({ bookingStatus: "cancelled" })
          .where(eq(sessionBookings.id, input.id));

        // Decrease participant count
        await db.update(swimmingSessions)
          .set({
            currentParticipants: sql`${swimmingSessions.currentParticipants} - 1`,
          })
          .where(eq(swimmingSessions.id, booking.sessionId));

        return { success: true };
      }),
  }),

  // Blog System
  blog: router({
    posts: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
        search: z.string().optional(),
        limit: z.number().default(10),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        let query = db.select({
          post: blogPosts,
          author: users,
        })
        .from(blogPosts)
        .leftJoin(users, eq(blogPosts.authorId, users.id));

        const conditions = [];
        if (input.category) {
          conditions.push(eq(blogPosts.category, input.category));
        }
        if (input.status) {
          conditions.push(eq(blogPosts.status, input.status));
        } else {
          conditions.push(eq(blogPosts.status, "published"));
        }
        if (input.search) {
          conditions.push(like(blogPosts.title, `%${input.search}%`));
        }

        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }

        const posts = await query
          .orderBy(desc(blogPosts.publishedAt))
          .limit(input.limit)
          .offset(input.offset);

        return posts;
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const [result] = await db
          .select({
            post: blogPosts,
            author: users,
          })
          .from(blogPosts)
          .leftJoin(users, eq(blogPosts.authorId, users.id))
          .where(eq(blogPosts.slug, input.slug));

        // Increment view count
        if (result) {
          await db.update(blogPosts)
            .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
            .where(eq(blogPosts.id, result.post.id));
        }

        return result;
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        excerpt: z.string().optional(),
        featuredImage: z.string().optional(),
        category: z.string(),
        tags: z.array(z.string()).optional(),
        status: z.enum(["draft", "published", "archived"]).default("draft"),
      }))
      .mutation(async ({ ctx, input }) => {
        const [post] = await db.insert(blogPosts).values({
          ...input,
          authorId: ctx.user.id,
          tags: input.tags ? JSON.stringify(input.tags) : null,
          publishedAt: input.status === "published" ? new Date() : null,
        });
        return { success: true, id: post.insertId };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        featuredImage: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.update(blogPosts)
          .set({
            ...data,
            tags: data.tags ? JSON.stringify(data.tags) : undefined,
            updatedAt: new Date(),
          })
          .where(eq(blogPosts.id, id));
        return { success: true };
      }),
  }),

  // Blog Comments
  comments: router({
    getByPostId: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        const comments = await db
          .select({
            comment: blogComments,
            user: users,
          })
          .from(blogComments)
          .leftJoin(users, eq(blogComments.userId, users.id))
          .where(eq(blogComments.postId, input.postId))
          .orderBy(desc(blogComments.createdAt));
        return comments;
      }),

    create: protectedProcedure
      .input(z.object({
        postId: z.number(),
        content: z.string(),
        parentCommentId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const [comment] = await db.insert(blogComments).values({
          ...input,
          userId: ctx.user.id,
          status: "approved",
        });
        return { success: true, id: comment.insertId };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.delete(blogComments).where(
          and(
            eq(blogComments.id, input.id),
            eq(blogComments.userId, ctx.user.id)
          )
        );
        return { success: true };
      }),
  }),

  // Likes System
  likes: router({
    toggle: protectedProcedure
      .input(z.object({
        entityType: z.enum(["blog_post", "product", "comment"]),
        entityId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const [existing] = await db.select().from(likes).where(
          and(
            eq(likes.userId, ctx.user.id),
            eq(likes.entityType, input.entityType),
            eq(likes.entityId, input.entityId)
          )
        );

        if (existing) {
          await db.delete(likes).where(eq(likes.id, existing.id));
          return { success: true, liked: false };
        } else {
          await db.insert(likes).values({
            userId: ctx.user.id,
            entityType: input.entityType,
            entityId: input.entityId,
          });
          return { success: true, liked: true };
        }
      }),

    getCount: publicProcedure
      .input(z.object({
        entityType: z.enum(["blog_post", "product", "comment"]),
        entityId: z.number(),
      }))
      .query(async ({ input }) => {
        const [result] = await db
          .select({ count: sql<number>`count(*)` })
          .from(likes)
          .where(
            and(
              eq(likes.entityType, input.entityType),
              eq(likes.entityId, input.entityId)
            )
          );
        return result.count;
      }),

    isLiked: protectedProcedure
      .input(z.object({
        entityType: z.enum(["blog_post", "product", "comment"]),
        entityId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        const [existing] = await db.select().from(likes).where(
          and(
            eq(likes.userId, ctx.user.id),
            eq(likes.entityType, input.entityType),
            eq(likes.entityId, input.entityId)
          )
        );
        return !!existing;
      }),
  }),

  // Product Categories
  categories: router({
    list: publicProcedure.query(async () => {
      const categories = await db.select().from(productCategories).orderBy(productCategories.displayOrder);
      return categories;
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const [category] = await db.select().from(productCategories).where(eq(productCategories.slug, input.slug));
        return category;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        parentCategoryId: z.number().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const [category] = await db.insert(productCategories).values(input);
        return { success: true, id: category.insertId };
      }),
  }),

  // Products
  products: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        search: z.string().optional(),
        status: z.enum(["active", "inactive", "out_of_stock"]).optional(),
        isFeatured: z.boolean().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        let query = db.select({
          product: products,
          category: productCategories,
        })
        .from(products)
        .leftJoin(productCategories, eq(products.categoryId, productCategories.id));

        const conditions = [];
        if (input.categoryId) {
          conditions.push(eq(products.categoryId, input.categoryId));
        }
        if (input.search) {
          conditions.push(like(products.name, `%${input.search}%`));
        }
        if (input.status) {
          conditions.push(eq(products.status, input.status));
        } else {
          conditions.push(eq(products.status, "active"));
        }
        if (input.isFeatured !== undefined) {
          conditions.push(eq(products.isFeatured, input.isFeatured));
        }

        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }

        const productList = await query
          .orderBy(desc(products.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return productList;
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const [result] = await db
          .select({
            product: products,
            category: productCategories,
          })
          .from(products)
          .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
          .where(eq(products.slug, input.slug));

        // Increment view count
        if (result) {
          await db.update(products)
            .set({ viewCount: sql`${products.viewCount} + 1` })
            .where(eq(products.id, result.product.id));
        }

        return result;
      }),

    create: protectedProcedure
      .input(z.object({
        categoryId: z.number(),
        name: z.string(),
        slug: z.string(),
        description: z.string(),
        shortDescription: z.string().optional(),
        price: z.string(),
        compareAtPrice: z.string().optional(),
        sku: z.string(),
        stockQuantity: z.number().default(0),
        images: z.array(z.string()).optional(),
        sizes: z.array(z.string()).optional(),
        colors: z.array(z.string()).optional(),
        brand: z.string().optional(),
        weight: z.string().optional(),
        dimensions: z.string().optional(),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        const [product] = await db.insert(products).values({
          ...input,
          images: input.images ? JSON.stringify(input.images) : null,
          sizes: input.sizes ? JSON.stringify(input.sizes) : null,
          colors: input.colors ? JSON.stringify(input.colors) : null,
          status: "active",
        });
        return { success: true, id: product.insertId };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        price: z.string().optional(),
        compareAtPrice: z.string().optional(),
        stockQuantity: z.number().optional(),
        images: z.array(z.string()).optional(),
        sizes: z.array(z.string()).optional(),
        colors: z.array(z.string()).optional(),
        brand: z.string().optional(),
        isFeatured: z.boolean().optional(),
        status: z.enum(["active", "inactive", "out_of_stock"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.update(products)
          .set({
            ...data,
            images: data.images ? JSON.stringify(data.images) : undefined,
            sizes: data.sizes ? JSON.stringify(data.sizes) : undefined,
            colors: data.colors ? JSON.stringify(data.colors) : undefined,
            updatedAt: new Date(),
          })
          .where(eq(products.id, id));
        return { success: true };
      }),
  }),

  // Shopping Cart
  cart: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      // Get or create cart
      let [cart] = await db.select().from(shoppingCarts).where(eq(shoppingCarts.userId, ctx.user.id));
      
      if (!cart) {
        const [newCart] = await db.insert(shoppingCarts).values({ userId: ctx.user.id });
        [cart] = await db.select().from(shoppingCarts).where(eq(shoppingCarts.id, newCart.insertId));
      }

      // Get cart items with product details
      const items = await db
        .select({
          cartItem: cartItems,
          product: products,
        })
        .from(cartItems)
        .leftJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.cartId, cart.id));

      return { cart, items };
    }),

    addItem: protectedProcedure
      .input(z.object({
        productId: z.number(),
        quantity: z.number().default(1),
        selectedSize: z.string().optional(),
        selectedColor: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get or create cart
        let [cart] = await db.select().from(shoppingCarts).where(eq(shoppingCarts.userId, ctx.user.id));
        
        if (!cart) {
          const [newCart] = await db.insert(shoppingCarts).values({ userId: ctx.user.id });
          [cart] = await db.select().from(shoppingCarts).where(eq(shoppingCarts.id, newCart.insertId));
        }

        // Get product price
        const [product] = await db.select().from(products).where(eq(products.id, input.productId));
        
        if (!product) {
          throw new Error("Product not found");
        }

        // Check if item already exists in cart
        const [existingItem] = await db.select().from(cartItems).where(
          and(
            eq(cartItems.cartId, cart.id),
            eq(cartItems.productId, input.productId),
            input.selectedSize ? eq(cartItems.selectedSize, input.selectedSize) : sql`${cartItems.selectedSize} IS NULL`,
            input.selectedColor ? eq(cartItems.selectedColor, input.selectedColor) : sql`${cartItems.selectedColor} IS NULL`
          )
        );

        if (existingItem) {
          // Update quantity
          await db.update(cartItems)
            .set({ quantity: sql`${cartItems.quantity} + ${input.quantity}` })
            .where(eq(cartItems.id, existingItem.id));
        } else {
          // Add new item
          await db.insert(cartItems).values({
            cartId: cart.id,
            productId: input.productId,
            quantity: input.quantity,
            selectedSize: input.selectedSize,
            selectedColor: input.selectedColor,
            price: product.price,
          });
        }

        return { success: true };
      }),

    updateItem: protectedProcedure
      .input(z.object({
        itemId: z.number(),
        quantity: z.number(),
      }))
      .mutation(async ({ input }) => {
        if (input.quantity <= 0) {
          await db.delete(cartItems).where(eq(cartItems.id, input.itemId));
        } else {
          await db.update(cartItems)
            .set({ quantity: input.quantity })
            .where(eq(cartItems.id, input.itemId));
        }
        return { success: true };
      }),

    removeItem: protectedProcedure
      .input(z.object({ itemId: z.number() }))
      .mutation(async ({ input }) => {
        await db.delete(cartItems).where(eq(cartItems.id, input.itemId));
        return { success: true };
      }),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      const [cart] = await db.select().from(shoppingCarts).where(eq(shoppingCarts.userId, ctx.user.id));
      if (cart) {
        await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
      }
      return { success: true };
    }),
  }),

  // Orders
  orders: router({
    list: protectedProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ ctx, input }) => {
        const orderList = await db
          .select()
          .from(orders)
          .where(eq(orders.userId, ctx.user.id))
          .orderBy(desc(orders.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return orderList;
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const [order] = await db
          .select()
          .from(orders)
          .where(
            and(
              eq(orders.id, input.id),
              eq(orders.userId, ctx.user.id)
            )
          );

        if (!order) {
          throw new Error("Order not found");
        }

        const items = await db
          .select({
            orderItem: orderItems,
            product: products,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

        return { order, items };
      }),

    create: protectedProcedure
      .input(z.object({
        shippingAddress: z.string(),
        billingAddress: z.string(),
        paymentMethod: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get cart items
        const [cart] = await db.select().from(shoppingCarts).where(eq(shoppingCarts.userId, ctx.user.id));
        
        if (!cart) {
          throw new Error("Cart not found");
        }

        const items = await db
          .select({
            cartItem: cartItems,
            product: products,
          })
          .from(cartItems)
          .leftJoin(products, eq(cartItems.productId, products.id))
          .where(eq(cartItems.cartId, cart.id));

        if (items.length === 0) {
          throw new Error("Cart is empty");
        }

        // Calculate totals
        let subtotal = 0;
        for (const item of items) {
          if (item.product) {
            subtotal += parseFloat(item.product.price) * item.cartItem.quantity;
          }
        }

        const tax = subtotal * 0.1; // 10% tax
        const shippingCost = 10; // Fixed shipping cost
        const total = subtotal + tax + shippingCost;

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${ctx.user.id}`;

        // Create order
        const [order] = await db.insert(orders).values({
          userId: ctx.user.id,
          orderNumber,
          subtotal: subtotal.toFixed(2),
          tax: tax.toFixed(2),
          shippingCost: shippingCost.toFixed(2),
          total: total.toFixed(2),
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: input.paymentMethod,
          shippingAddress: input.shippingAddress,
          billingAddress: input.billingAddress,
          notes: input.notes,
        });

        // Create order items
        for (const item of items) {
          if (item.product) {
            await db.insert(orderItems).values({
              orderId: order.insertId,
              productId: item.product.id,
              productName: item.product.name,
              quantity: item.cartItem.quantity,
              selectedSize: item.cartItem.selectedSize,
              selectedColor: item.cartItem.selectedColor,
              price: item.product.price,
              subtotal: (parseFloat(item.product.price) * item.cartItem.quantity).toFixed(2),
            });

            // Update product stock
            await db.update(products)
              .set({
                stockQuantity: sql`${products.stockQuantity} - ${item.cartItem.quantity}`,
              })
              .where(eq(products.id, item.product.id));
          }
        }

        // Clear cart
        await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));

        return { success: true, orderId: order.insertId, orderNumber };
      }),
  }),

  // Product Reviews
  reviews: router({
    getByProductId: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        const reviews = await db
          .select({
            review: productReviews,
            user: users,
          })
          .from(productReviews)
          .leftJoin(users, eq(productReviews.userId, users.id))
          .where(
            and(
              eq(productReviews.productId, input.productId),
              eq(productReviews.status, "approved")
            )
          )
          .orderBy(desc(productReviews.createdAt));
        return reviews;
      }),

    create: protectedProcedure
      .input(z.object({
        productId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        content: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const [review] = await db.insert(productReviews).values({
          ...input,
          userId: ctx.user.id,
          status: "pending",
        });
        return { success: true, id: review.insertId };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        rating: z.number().min(1).max(5).optional(),
        title: z.string().optional(),
        content: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.update(productReviews)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(productReviews.id, id),
              eq(productReviews.userId, ctx.user.id)
            )
          );
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.delete(productReviews).where(
          and(
            eq(productReviews.id, input.id),
            eq(productReviews.userId, ctx.user.id)
          )
        );
        return { success: true };
      }),
  }),


});

export type AppRouter = typeof appRouter;

