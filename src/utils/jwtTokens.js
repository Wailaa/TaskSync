import jwt from 'jsonwebtoken';

export const createAccessToken = (user) => {
    const accessToken = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES });
    return accessToken
};

export const createRefreshToken = (user) => {
    const refreshToken = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES });
    return refreshToken
};

export const isTokenValid = async (token) => {
    const result = jwt.verify(token, process.env.JWT_SECRET, (err, username) => {
        if (err) {
            return false;
        }
        return username
    });
    return result;
};

export const getClaims = (token) => {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
        console.error("error decoding token: ", error);
        return null;
    }
    return decoded;

};
