import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import {prisma} from "../utils/prisma.js"

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email вже використовується" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { username, email, password: hashedPassword },
    });

    res.status(201).json({ token: generateToken(user.id) });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Невірні дані" });
    }

    res.json({ token: generateToken(user.id) });
};