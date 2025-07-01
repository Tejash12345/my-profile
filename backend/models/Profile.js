import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  photo: { type: String },
  email: { type: String },
  linkedin: { type: String },
  github: { type: String }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema); 