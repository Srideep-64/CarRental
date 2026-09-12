import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const bookingLockSchema = new mongoose.Schema({
    car: { type: ObjectId, ref: "Car", required: true, unique: true }
}, { timestamps: true })

// auto-expire stale locks after 10 seconds (safety net if a request crashes mid-booking)
bookingLockSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 })

const BookingLock = mongoose.model("BookingLock", bookingLockSchema)
export default BookingLock