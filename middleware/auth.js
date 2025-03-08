const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        console.log("Auth Header:", req.headers.authorization); 

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - Token Missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.customerId = decoded.customerId; 
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
