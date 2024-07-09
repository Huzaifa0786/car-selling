const User = require("../models/user");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid password!" });
    }

    const token = await user.generateAuthToken();

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25893000000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({
      message: "Sign in successful!",
      token: token,
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error occurred while logging in:", error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

module.exports = login;
