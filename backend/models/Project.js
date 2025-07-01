import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  github: { type: String },
  demo: { type: String },
  images: [String],
  imageData: Buffer,
  imageType: String
}, { timestamps: true });

export default mongoose.model('Project', projectSchema); 