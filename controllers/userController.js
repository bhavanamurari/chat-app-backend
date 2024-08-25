const express = require('express');
const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const loginController = expressAsyncHandler(async (req, res) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    console.log(user);
    if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
    } else {
        throw new Error("Invalid credentials");
    }
}); ;

const registerController =expressAsyncHandler( async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.send(400);
        throw Error("Input fields should not be empty");
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(409).json({ message: "User already exists" }); 
    }
    const userNameExist = await User.findOne({ name });
    if (userNameExist) {
      return res.status(422).json({ message: "Username already taken" });
    }

    const user = await User.create({ name, email, password });
    if (user) {
        res.status(201).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token:generateToken(user._id),
         });
    } else {
        res.status(400);
        throw new Error("Registration Error");
    }
});

const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    } : {};
    const users = await User.find(keyword).find({
        _id: { $ne: req.user._id },
    });
    res.send(users);
});

module.exports = { loginController, registerController, fetchAllUsersController };
