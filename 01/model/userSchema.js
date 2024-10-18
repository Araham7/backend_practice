import { Schema, model } from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = Schema({
    name: {
        type: String,
        unique: [true, "Name must be unique!"],
        required: [true, "Name is required!"],
        minLength: [5, "Name must be of minimum 5 characters!"],
        trim: true
    },
    email: {
        type: String,
        unique: [true, "Email must be unique!"],
        trim: true,
        required: [true, "Email is required!"],
        lowercase: true
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minLength: [8, "Password must be at least 8 characters!"],
      select: false // Set this to false to exclude the password from query results
  }  
},{
    timestamps: true 
});

// Hash password before saving to the database.
userSchema.pre('save', async function (next) {
  // If password is not modified then do not hash it
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

// method for generating the jwt token.
userSchema.methods = {
    jwtToken() {
      return JWT.sign(
        { id: this._id, email: this.email },
        process.env.SECRET,
        { expiresIn: '24h' } // 24 hours
      );
    },
  }

// creating model of schema.
const User = model("01_User", userSchema);
export { User };








