export const getPong = async (req, res, next) => {
  try {
    res.json({"message": "pong"});
  } catch (error) {
    next(error);
  }
};

 