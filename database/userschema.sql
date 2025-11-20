-- // create roles collection + unique name
db.createCollection("roles", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name"],
            properties: {
                name: { bsonType: "string" },
                description: { bsonType: "string" }
            }
        }
    }
});
db.roles.createIndex({ name: 1 }, { unique: true });

-- // users collection (profile embedded)
db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["email", "password_hash", "role_id"],
            properties: {
                email: { bsonType: "string" },
                password_hash: { bsonType: "string" },
                role_id: { bsonType: "objectId" },
                status: { enum: ["pending","active","suspended","inactive"], bsonType: "string" },
                is_email_verified: { bsonType: "bool" },
                failed_login_attempts: { bsonType: "int" },
                last_login: { bsonType: "date" },
                created_at: { bsonType: "date" },
                updated_at: { bsonType: "date" },
                profile: {
                    bsonType: "object",
                    properties: {
                        first_name: { bsonType: "string" },
                        last_name: { bsonType: "string" },
                        phone: { bsonType: "string" },
                        date_of_birth: { bsonType: "date" },
                        address: { bsonType: "object" },
                        emergency_contact: { bsonType: "object" }
                    }
                }
            }
        }
    }
});
-- // case-insensitive unique email via collation (works on index queries & uniqueness)
db.users.createIndex({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

-- // indexes for role/status
db.users.createIndex({ role_id: 1 });
db.users.createIndex({ status: 1 });

-- // tokens collection
db.createCollection("user_tokens", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "token", "type", "created_at"],
            properties: {
                user_id: { bsonType: "objectId" },
                token: { bsonType: "string" },
                type: { bsonType: "string" },
                expires_at: { bsonType: "date" },
                created_at: { bsonType: "date" },
                consumed_at: { bsonType: "date" }
            }
        }
    }
});
db.user_tokens.createIndex({ user_id: 1 });
db.user_tokens.createIndex({ token: 1 });
