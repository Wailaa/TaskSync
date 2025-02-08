export const clientRole = (role) => {

    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You don't have access to this resource" });
        }
        next();
    };
};

