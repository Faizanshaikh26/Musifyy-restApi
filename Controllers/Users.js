const { Users } = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "Secret-ecom";

exports.login = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.signUp = async (req, res) => {
  try {
    const alreadyUser = await Users.findOne({ email: req.body.email });
    if (alreadyUser) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = new Users({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ success: true, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
