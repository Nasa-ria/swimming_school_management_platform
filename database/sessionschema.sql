

use swimming_school;

-- // sessions collection with validator (reserved maintained by app)
db.createCollection("sessions", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title","start_time","end_time","capacity","status","reserved"],
            properties: {
                title: { bsonType: "string" },
                description: { bsonType: "string" },
                location: { bsonType: "string" },
                instructor: { bsonType: "string" },
                start_time: { bsonType: "date" },
                end_time: { bsonType: "date" },
                capacity: { bsonType: "int", minimum: 0 },
                reserved: { bsonType: "int", minimum: 0 },
                status: { enum: ["draft","scheduled","completed","cancelled"] },
                price: { bsonType: "double" },
                created_at: { bsonType: "date" },
                updated_at: { bsonType: "date" }
            }
        }
    }
});

-- // members (minimal)
db.createCollection("members", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["first_name","last_name","email"],
            properties: {
                first_name: { bsonType: "string" },
                last_name: { bsonType: "string" },
                email: { bsonType: "string" },
                created_at: { bsonType: "date" }
            }
        }
    }
});

-- // bookings collection
db.createCollection("bookings", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["session_id","member_id","booking_status","num_spots","booked_at"],
            properties: {
                session_id: { bsonType: "objectId" },
                member_id: { bsonType: "objectId" },
                booking_status: { enum: ["booked","waitlist","cancelled","checked_in","no_show"] },
                num_spots: { bsonType: "int", minimum: 1 },
                booked_at: { bsonType: "date" },
                cancelled_at: { bsonType: "date" },
                notes: { bsonType: "string" }
            }
        }
    }
});

-- // Indexes
db.sessions.createIndex({ start_time: 1 });
db.bookings.createIndex({ session_id: 1 });
db.bookings.createIndex({ member_id: 1 });
db.members.createIndex({ email: 1 }, { unique: true });

-- // Create a view that shows reserved and remaining_spots per session
db.createView("session_capacity_view", "sessions", [
    {
        $lookup: {
            from: "bookings",
            let: { sid: "$_id" },
            pipeline: [
                { $match: { $expr: { $and: [
                    { $eq: ["$session_id", "$$sid"] },
                    { $in: ["$booking_status", ["booked","checked_in"]] }
                ] } } },
                { $group: { _id: null, reserved: { $sum: "$num_spots" } } }
            ],
            as: "b"
        }
    },
    { $addFields: { reserved: { $ifNull: [{ $arrayElemAt: ["$b.reserved", 0] }, 0] } } },
    { $project: {
            _id: 0,
            session_id: "$_id",
            title: 1,
            start_time: 1,
            end_time: 1,
            capacity: 1,
            reserved: 1,
            remaining_spots: { $subtract: ["$capacity", "$reserved"] }
    } }
]);
