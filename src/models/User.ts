import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// 1. The Interface (For TypeScript)
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  comparePassword(attempt: string): Promise<boolean>;
}

// 2. The Schema (For MongoDB)
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

// 3. The Armor (Password Hashing before save)
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// 4. The Weapon (Password Checking)
UserSchema.methods.comparePassword = async function (
  attempt: string,
): Promise<boolean> {
  return await bcrypt.compare(attempt, this.passwordHash);
};

export const User = mongoose.model<IUser>("User", UserSchema);
