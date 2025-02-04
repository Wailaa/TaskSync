export const clientRole = (role) => {
    
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden: You don't have access to this resource" });
        }
        next();
    };
};

