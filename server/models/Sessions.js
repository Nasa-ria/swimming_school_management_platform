const mongoose = require('mongoose');

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;
const Decimal128 = Schema.Types.Decimal128;

// Session schema
const SessionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    instructor: { type: String },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 0 },
    reserved: { type: Number, required: true, min: 0, default: 0 }, // maintained by app
    status: { type: String, required: true, enum: ['draft', 'scheduled', 'completed', 'cancelled'] },
    price: { type: Decimal128 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Indexes for sessions
SessionSchema.index({ start_time: 1 });

// Static to produce the same "session_capacity_view" result via aggregation.
// Optional `match` object can filter sessions (e.g. by date).
SessionSchema.statics.getCapacityView = function(match = {}) {
    return this.aggregate([
        { $match: match },
        {
            $lookup: {
                from: 'bookings',
                let: { sid: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$session_id', '$$sid'] },
                                    { $in: ['$booking_status', ['booked', 'checked_in']] }
                                ]
                            }
                        }
                    },
                    { $group: { _id: null, reserved: { $sum: '$num_spots' } } }
                ],
                as: 'b'
            }
        },
        {
            $addFields: {
                reserved: { $ifNull: [{ $arrayElemAt: ['$b.reserved', 0] }, 0] }
            }
        },
        {
            $project: {
                _id: 0,
                session_id: '$_id',
                title: 1,
                start_time: 1,
                end_time: 1,
                capacity: 1,
                reserved: 1,
                remaining_spots: { $subtract: ['$capacity', '$reserved'] }
            }
        }
    ]);
};

const Session = mongoose.model('Session', SessionSchema);

// Member schema
const MemberSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now }
});

MemberSchema.index({ email: 1 }, { unique: true });

const Member = mongoose.model('Member', MemberSchema);

// Booking schema
const BookingSchema = new Schema({
    session_id: { type: ObjectId, ref: 'Session', required: true },
    member_id: { type: ObjectId, ref: 'Member', required: true },
    booking_status: { type: String, required: true, enum: ['booked', 'waitlist', 'cancelled', 'checked_in', 'no_show'] },
    num_spots: { type: Number, required: true, min: 1 },
    booked_at: { type: Date, required: true, default: Date.now },
    cancelled_at: { type: Date },
    notes: { type: String }
});

// Indexes for bookings
BookingSchema.index({ session_id: 1 });
BookingSchema.index({ member_id: 1 });

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = {
    Session,
    Member,
    Booking
};
