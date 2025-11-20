

-- // Authors collection
db.createCollection("authors", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "createdAt"],
            properties: {
                name: { bsonType: "string", description: "Author full name" },
                email: { bsonType: "string", pattern: "^.+@.+\\..+$", description: "Unique email" },
                role: { enum: ["admin", "editor", "contributor", "guest"], description: "Role" },
                bio: { bsonType: "string" },
                avatarUrl: { bsonType: "string" },
                createdAt: { bsonType: "date" },
                updatedAt: { bsonType: "date" }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});
db.authors.createIndex({ email: 1 }, { unique: true });

-- // Blogs collection
db.createCollection("blogs", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "slug", "content", "authorId", "createdAt", "status"],
            properties: {
                title: { bsonType: "string" },
                slug: { bsonType: "string", description: "URL-friendly unique slug" },
                excerpt: { bsonType: "string" },
                content: { bsonType: "string" },
                authorId: { bsonType: "objectId" },
                tags: {
                    bsonType: "array",
                    items: { bsonType: "string" }
                },
                status: { enum: ["draft", "published", "archived"] },
                publishedAt: { bsonType: "date" },
                createdAt: { bsonType: "date" },
                updatedAt: { bsonType: "date" },
                views: { bsonType: "int" }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});
db.blogs.createIndex({ slug: 1 }, { unique: true });
db.blogs.createIndex({ authorId: 1 });
db.blogs.createIndex({ tags: 1 });
db.blogs.createIndex({ publishedAt: -1 });

-- // Comments collection
db.createCollection("comments", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["blogId", "content", "createdAt"],
            properties: {
                blogId: { bsonType: "objectId" },
                authorName: { bsonType: "string" },
                authorEmail: { bsonType: "string", pattern: "^.+@.+\\..+$" },
                content: { bsonType: "string" },
                approved: { bsonType: "bool" },
                createdAt: { bsonType: "date" },
                updatedAt: { bsonType: "date" }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "warn"
});
db.comments.createIndex({ blogId: 1 });
db.comments.createIndex({ approved: 1 });

-- // Optional: tags collection for normalized tag data
db.createCollection("tags", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "slug", "createdAt"],
            properties: {
                name: { bsonType: "string" },
                slug: { bsonType: "string" },
                description: { bsonType: "string" },
                createdAt: { bsonType: "date" }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});
db.tags.createIndex({ slug: 1 }, { unique: true });

-- // Sample helper: create a sample author and blog (uncomment to use)
/*
const authorId = db.authors.insertOne({
    name: "Example Author",
    email: "author@example.com",
    role: "editor",
    createdAt: new Date()
}).insertedId;

db.blogs.insertOne({
    title: "Welcome to the Swim School Blog",
    slug: "welcome-swim-school-blog",
    content: "First post content...",
    authorId,
    tags: ["announcement","swimming"],
    status: "published",
    publishedAt: new Date(),
    createdAt: new Date(),
    views: 0
});
*/