module.exports = function asyncMiddleware(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log(err);
      }
      res.send({ error: true, msg: "Internal Server Error" });
    }
  };
};
