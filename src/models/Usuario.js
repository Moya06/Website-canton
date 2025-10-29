import { Schema, model } from "mongoose";

//Schema
let UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be provided"],
    },
    last_name: {
      type: String,
      required: [true, "Last name must be provided"],
    },
    email: {
      type: String,
      required: [true, "Email must be provided"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password must be provided"],
    },
    rol: {
      type: String,
      required: true,
      enum: ["ADMIN_ROLE", "CITIZEN_ROLE", "ENTREPRENEUR_ROLE"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    birthdate: {
      type: Date,
    },
  },
  { versionKey: false },
);

//Model

UserSchema.methods.toJSON = function toJSON() {
  const { password, ...userWithoutPassword } = this.toObject();
  return userWithoutPassword;
};

export default model("Users", UserSchema);

