import bcrypt from "bcryptjs";
import { Router } from "express";
import { prisma } from "../prisma.js";
import { createToken } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validators/schemas.js";

export const authRouter = Router();
authRouter.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
    }
    return res.json({ success: true, data: { token: createToken(user), user: { id: user.id, email: user.email, role: user.role } } });
  } catch (error) { return next(error); }
});
