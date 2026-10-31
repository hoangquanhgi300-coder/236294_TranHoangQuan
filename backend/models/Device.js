const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    // Thuộc tính unique: true sẽ đảm bảo không cho phép trùng mã thiết bị
    deviceId: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    deviceType: { type: String, required: true },
    room: { type: String, required: true },
    brand: { type: String },
    model: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, required: true },
    purchaseDate: { type: Date },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);