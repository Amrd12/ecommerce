import { prisma } from "../../../index.js";
import { UserTypeEnum } from "../enums/role_enum.js";

export const ensureAuthenticated = (req, res, next) => {
  if (req.session.user) {
    // User is logged in, proceed to the next middleware or route
    return next();
  }
  // Store the intended URL in session and redirect to login
  req.session.redirectTo = req.originalUrl;
  res.redirect("/login");
};

export const ensureAdmin = async (req, res, next) => {
  if (req.session.user) {
    const role = await prisma.account.findUnique({
      where: {
        id: req.session.user.id,
      },
    });
    if (role.role == UserTypeEnum.admin) {
      // User is an admin, proceed to the next middleware or route
      return next();
    } else {
      // If not an admin, redirect to a forbidden page or home
      // User is an admin, proceed to the next middleware or route
      res.redirect("/");
    }
  }
  // If not an admin, redirect to a forbidden page or home
  res.redirect("/login");
};
