import bcrypt from "bcryptjs";
import { Router } from "express";
import { prisma } from "../prisma.js";
import { authenticate, createToken } from "../middleware/auth.js";
import { cookieOptions } from "../config/security.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validators/schemas.js";

export const authRouter = Router();
export const loginRouter = Router();

loginRouter.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
    }
    res.cookie("tb_session", createToken(user), cookieOptions);
    return res.json({ success: true, data: { user: { id: user.id, email: user.email, role: user.role } } });
  } catch (error) { return next(error); }
});

authRouter.get("/me", authenticate, (req, res) => res.json({ success: true, data: { id: req.user.sub, email: req.user.email, role: req.user.role } }));
authRouter.post("/logout", (_req, res) => res.clearCookie("tb_session", { httpOnly: true, secure: cookieOptions.secure, sameSite: cookieOptions.sameSite, path: "/" }).status(204).end());
