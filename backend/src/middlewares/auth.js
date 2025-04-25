const admin = require("../config/firebaseAdmin");
const { getUserRole } = require("../Quries/user");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    console.log(req.headers.authorization);
    return res.status(401).json({
      message: "Unauthorized user, token not found",
    });
  }

  try {
    const decodeToken = await admin.auth().verifyIdToken(token);
    req.user = decodeToken;
    const userRole = await getUserRole({ uid: decodeToken.uid });
    req.user.role = userRole;
    //console.log(req.user);

    next();
  } catch (error) {
    console.log(error);
    return res.status({
      message: "Unauthorized from authentication",
      error,
    });
  }
};

module.exports = authMiddleware;
