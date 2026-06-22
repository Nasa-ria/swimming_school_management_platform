const mongoose = require('mongoose');

// e-commence-schema.mongodb.js
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;
const Decimal128 = Schema.Types.Decimal128;

const AddressSchema = new Schema({
    user: { type: ObjectId, ref: 'User', required: true },
    label: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const CategorySchema = new Schema({
    parent: { type: ObjectId, ref: 'Category', default: null },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    position: { type: Number, default: 0 }
}, { timestamps: true });

const ProductImageSchema = new Schema({
    url: { type: String, required: true },
    altText: String,
    position: { type: Number, default: 0 }
}, { _id: true });

const ProductSchema = new Schema({
    sku: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    description: String,
    category: { type: ObjectId, ref: 'Category' },
    price: { type: Decimal128, default: 0.00 },
    salePrice: { type: Decimal128, default: null },
    isActive: { type: Boolean, default: true },
    images: [ProductImageSchema]
}, { timestamps: true });

ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });

const ProductVariantSchema = new Schema({
    product: { type: ObjectId, ref: 'Product', required: true },
    sku: { type: String, sparse: true },
    attributes: { type: Schema.Types.Mixed }, // { size: "M", color: "red" }
    price: { type: Decimal128, default: null },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

ProductVariantSchema.index({ product: 1 });

const InventorySchema = new Schema({
    productVariant: { type: ObjectId, ref: 'ProductVariant', required: true },
    warehouse: String,
    quantity: { type: Number, default: 0 }
}, { timestamps: true });

InventorySchema.index({ productVariant: 1, warehouse: 1 }, { unique: true });

const CartItemSchema = new Schema({
    user: { type: ObjectId, ref: 'User', required: true },
    productVariant: { type: ObjectId, ref: 'ProductVariant', required: true },
    quantity: { type: Number, default: 1 },
    addedAt: { type: Date, default: Date.now }
});
CartItemSchema.index({ user: 1, productVariant: 1 }, { unique: true });

const OrderItemSchema = new Schema({
    product: { type: ObjectId, ref: 'Product' },
    productVariant: { type: ObjectId, ref: 'ProductVariant' },
    sku: String,
    name: String,
    unitPrice: { type: Decimal128, default: 0.00 },
    quantity: { type: Number, default: 1 },
    lineTotal: { type: Decimal128, default: 0.00 }
}, { _id: false });

const OrderSchema = new Schema({
    user: { type: ObjectId, ref: 'User' },
    orderNumber: { type: String, unique: true, required: true },
    status: { type: String, enum: ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled', 'refunded'], default: 'pending' },
    subtotal: { type: Decimal128, default: 0.00 },
    tax: { type: Decimal128, default: 0.00 },
    shippingCost: { type: Decimal128, default: 0.00 },
    discount: { type: Decimal128, default: 0.00 },
    total: { type: Decimal128, default: 0.00 },
    paymentMethod: String,
    shippingAddress: { type: ObjectId, ref: 'Address' },
    billingAddress: { type: ObjectId, ref: 'Address' },
    items: [OrderItemSchema],
    placedAt: { type: Date, default: Date.now }
}, { timestamps: true });

OrderSchema.index({ user: 1 });

const PaymentSchema = new Schema({
    order: { type: ObjectId, ref: 'Order', required: true },
    amount: { type: Decimal128, required: true },
    method: String,
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    paidAt: Date
}, { timestamps: true });

const ShipmentSchema = new Schema({
    order: { type: ObjectId, ref: 'Order', required: true },
    carrier: String,
    trackingNumber: String,
    status: { type: String, enum: ['ready', 'shipped', 'in_transit', 'delivered', 'returned'], default: 'ready' },
    shippedAt: Date,
    deliveredAt: Date
}, { timestamps: true });

const CouponSchema = new Schema({
    code: { type: String, required: true, unique: true },
    description: String,
    discountType: { type: String, enum: ['percent', 'fixed'], required: true },
    discountValue: { type: Decimal128, required: true },
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    startsAt: Date,
    endsAt: Date,
    minOrderAmount: { type: Decimal128, default: null },
    active: { type: Boolean, default: true }
}, { timestamps: true });

const ReviewSchema = new Schema({
    user: { type: ObjectId, ref: 'User' },
    product: { type: ObjectId, ref: 'Product' },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    body: String,
    approved: { type: Boolean, default: false }
}, { timestamps: true });

const WishlistItemSchema = new Schema({
    productVariant: { type: ObjectId, ref: 'ProductVariant', required: true },
    addedAt: { type: Date, default: Date.now }
}, { _id: true });

const WishlistSchema = new Schema({
    user: { type: ObjectId, ref: 'User', required: true },
    name: { type: String, default: 'Default' },
    items: [WishlistItemSchema]
}, { timestamps: true });

module.exports = {
    Address: mongoose.model('Address', AddressSchema),
    Category: mongoose.model('Category', CategorySchema),
    Product: mongoose.model('Product', ProductSchema),
    ProductVariant: mongoose.model('ProductVariant', ProductVariantSchema),
    Inventory: mongoose.model('Inventory', InventorySchema),
    CartItem: mongoose.model('CartItem', CartItemSchema),
    Order: mongoose.model('Order', OrderSchema),
    Payment: mongoose.model('Payment', PaymentSchema),
    Shipment: mongoose.model('Shipment', ShipmentSchema),
    Coupon: mongoose.model('Coupon', CouponSchema),
    Review: mongoose.model('Review', ReviewSchema),
    Wishlist: mongoose.model('Wishlist', WishlistSchema)
};
