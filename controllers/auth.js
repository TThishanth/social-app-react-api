import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {

    const { username, email, password, name } = req.body;

    // Validate input data
    if (!username || !email || !password || !name) {
        return res.status(400).json("All fields are required.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
        return res.status(400).json("Invalid email format.");
    }
    
    // Check user already exist or not
    const q = "SELECT * FROM users WHERE email = ?";

    db.query(q, [ email ], (err, data) => {

        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("User already exists!");
    
        // Create a new user
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)";

        const values = [ username, email, hashedPassword, name ];

        db.query(q, [ values ], (err,data) => {

            if(err) return res.status(500).json(err);
            return res.status(200).json("User has been created.");

        });
    });

}

export const login = (req, res) => {

    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [ req.body.username ], (err, data) => {

        if(err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json("User not found!");

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if(!checkPassword) return res.status(400).json("Wrong Password!");

        const token = jwt.sign({ id: data[0].id }, "secretkey");

        const { password, ...others } = data[0];

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(others);

    });
}

export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json("User has been logged out!");
}

