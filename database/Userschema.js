const mongoose = require('mongoose');

const { Schema } = mongoose;

/*
    Converted Mongo shell schema/indexes into Mongoose models:
    - Role (roles)
    - User (users) with embedded profile and timestamps mapped to created_at/updated_at
    - UserToken (user_tokens)
*/

const RoleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
}, { collection: 'roles' });

RoleSchema.index({ name: 1 }, { unique: true });

const UserSchema = new Schema({
    email: { type: String, required: true },
    password_hash: { type: String, required: true },
    role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    status: { type: String, enum: ['pending', 'active', 'suspended', 'inactive'], default: 'pending' },
    is_email_verified: { type: Boolean, default: false },
    failed_login_attempts: { type: Number, default: 0 },
    last_login: { type: Date },
    profile: {
        first_name: { type: String },
        last_name: { type: String },
        phone: { type: String },
        date_of_birth: { type: Date },
        address: { type: Schema.Types.Mixed },
        emergency_contact: { type: Schema.Types.Mixed }
    }
}, {
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Case-insensitive unique email (collation)
UserSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
UserSchema.index({ role_id: 1 });
UserSchema.index({ status: 1 });

const UserTokenSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    type: { type: String, required: true },
    expires_at: { type: Date },
    created_at: { type: Date, default: Date.now, required: true },
    consumed_at: { type: Date }
}, { collection: 'user_tokens' });

UserTokenSchema.index({ user_id: 1 });
UserTokenSchema.index({ token: 1 });

module.exports = {
    Role: mongoose.model('Role', RoleSchema),
    User: mongoose.model('User', UserSchema),
    UserToken: mongoose.model('UserToken', UserTokenSchema)
};
