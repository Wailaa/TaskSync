import jwt from 'jsonwebtoken';

export const createAccessToken = (username) => {
    const accessToken = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES });
    return accessToken
};

export const createRefreshToken = (username) => {
    const refreshToken = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES });
    return refreshToken
};

export const isTokenValid = async (token) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return false;
        }
        return user
    });
};

export const getClaims = (token) => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            throw new Error('Invalid token or missing expiration time');
        }
        return decoded;
    } catch (error) {
        throw new Error('Failed to decode token');
    }
};