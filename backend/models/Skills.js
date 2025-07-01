import mongoose from 'mongoose';

const skillsSchema = new mongoose.Schema({
  frontend: [String],
  backend: [String],
  "Developer Tools": [String],
  "Technologies/Frameworks/Database": [String]
}, { timestamps: true });

export default mongoose.model('Skills', skillsSchema);
