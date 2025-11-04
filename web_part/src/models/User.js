import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  image: {
    type: String,
  }
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
export default mongoose.models.User || mongoose.model("User", userSchema);
