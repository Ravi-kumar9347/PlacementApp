import { User } from "../models/user.model.js";
import { asyncMiddleware } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/generateToken.js";

const signUp = asyncMiddleware(async (req, res, next) => {
  try {
    // Extracting necessary data from request body
    const { name, email, password } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user already exists, return an error response
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user instance with the provided data
    const newUser = new User({
      name,
      email,
      password,
    });

    // Save the new user to the database
    await newUser.save();

    // Return a success response with the newly created user data and token
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { token: generateToken(newUser._id), ...newUser._doc },
          "User created successfully"
        )
      );
  } catch (error) {
    // Handle any errors that occur during the signup process
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const signIn = asyncMiddleware(async (req, res, next) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Find the user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist!" });
    }

    // If user is found and password matches, generate token and return success response
    if (user && (await user.matchPassword(password))) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { token: generateToken(user._id), ...user._doc },
            "Sign in successful"
          )
        );
    } else {
      // If user is not found or password does not match, throw an error
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    // Handle any errors that occur during the sign-in process
    console.error("Error during sign-in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const tokenIsValid = asyncMiddleware(async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user data
const getUserData = asyncMiddleware(async (req, res, next) => {
  // Extract user ID from the request
  const userId = req.user;

  // Find the user with the provided ID
  const user = await User.findById(userId);

  if (!user) {
    // If user is not found, return an error response
    return res.status(404).json({ message: "User not found" });
  }

  // If user is found, return success response with user data and token
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...user._doc, token: req.token },
        "User data retrieved successfully"
      )
    );
});

export { signUp, signIn, getUserData, tokenIsValid };
