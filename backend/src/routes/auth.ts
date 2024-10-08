import { Router, Response, Request } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Credenciais inválidas" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ error: "Credenciais inválidas" });
      return;
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao autenticar usuário" });
  }
});

export default router;
