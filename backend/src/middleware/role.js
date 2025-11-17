export const allowRoles = (...allowed) => {
  return (req, res, next) => {
    const user = req.user; // user injected by auth middleware

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowed.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};
