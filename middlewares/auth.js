// const { getUser } = require("../service/auth");
const { getUser } = require("../service/jwt_auth");

function checkForAuth(req, res, next) {
  //const authorizationHeaderValue = req.headers["authorization"];
  const tokenCookie = req.cookies?.token;

  req.user = null;

  // if (
  //   !authorizationHeaderValue ||
  //   !authorizationHeaderValue.startsWith("Bearer")
  // ) {
  //   return next();
  // }

  if (!tokenCookie) return next();

  //const token = userUid.split("Bearer ")[1];
  const token = tokenCookie;
  const user = getUser(token);

  req.user = user;
  return next();
}

// async function restrictToLoggedInUserOnly(req, res, next) {
//   //const userId = req.cookies.uid;
//   const userUid = req.header["authorization"];

//   if (!userUid) return res.redirect("/login");
//   const token = userUid.split("Bearer ")[1];
//   //const user = getUser(userId);
//   const user = getUser(token);

//   if (!user) return res.redirect("/login");

//   req.user = user;
//   next();
// }

// async function checkAuth(req, res, next) {
//   // const userId = req.cookies?.uid;
//   const userUid = req.header["authorization"];
//   const token = userUid.split("Bearer ")[1];

//   // const user = getUser(userId);
//   const user = getUser(token);

//   req.user = user;
//   next();
// }

function restrictTo(roles) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");

    if (!roles.includes(req.user.role)) return res.end("unauthorized user");

    return next();
  };
}

module.exports = {
  // restrictToLoggedInUserOnly,
  // checkAuth,
  checkForAuth,
  restrictTo,
};

//we need to refactor this so
