db.createCollection("students", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["firstName", "lastName", "email", "phoneNumber", "enrollmentDate"],
            properties: {
                _id: {
                    bsonType: "objectId"
                },
                firstName: {
                    bsonType: "string",
                    description: "Student's first name"
                },
                lastName: {
                    bsonType: "string",
                    description: "Student's last name"
                },
                email: {
                    bsonType: "string",
                    description: "Student's email address"
                },
                phoneNumber: {
                    bsonType: "string",
                    description: "Student's phone number"
                },
                dateOfBirth: {
                    bsonType: "date",
                    description: "Student's date of birth"
                },
                enrollmentDate: {
                    bsonType: "date",
                    description: "Date student enrolled"
                },
                swimLevel: {
                    bsonType: "string",
                    enum: ["Beginner", "Intermediate", "Advanced", "Competitive"],
                    description: "Current swimming proficiency level"
                },
                classId: {
                    bsonType: "objectId",
                    description: "Reference to assigned class"
                },
                isActive: {
                    bsonType: "bool",
                    description: "Whether student is currently active"
                },
                emergencyContact: {
                    bsonType: "object",
                    properties: {
                        name: { bsonType: "string" },
                        phoneNumber: { bsonType: "string" },
                        relationship: { bsonType: "string" }
                    }
                },
                createdAt: {
                    bsonType: "date"
                },
                updatedAt: {
                    bsonType: "date"
                }
            }
        }
    }
});