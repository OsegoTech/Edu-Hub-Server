import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required']
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    next();
  }

  // hash the password using our new salt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
