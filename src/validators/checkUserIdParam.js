const checkUserIdParam = (userId, res) => {
  const check = /^\d+$/.test(userId);

  if (!check) {
    res.status(422).send({ error: `Invalid param userId : \`${userId}\`` });

    return false;
  }

  return true;
};

module.exports = checkUserIdParam;
