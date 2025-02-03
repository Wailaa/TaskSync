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

export const refreshAccessToken = async (refreshToken) => {
    const user = await isTokenValid(refreshToken);
    if (!user) {
        return nil
    }
    const accessToken = createAccessToken(user);
    return accessToken;
}