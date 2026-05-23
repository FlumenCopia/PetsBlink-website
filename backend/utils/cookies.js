exports.setCookies = (res, tokens) => {
  res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
  res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
};