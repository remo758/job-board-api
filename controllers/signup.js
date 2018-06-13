const signup = (User, bcrypt, jwt, APP_SECRET, Joi) => (req, res) => {
  const { email, password } = req.body;

  // validation
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
  });

  Joi.validate({ email, password }, schema)
    .then(() => {
      User.findOne({ email })
        .then(user => {
          user
            ? res.status(400).json("Email already exists")
            : new User({
                email,
                password: bcrypt.hashSync(password)
              })
                .save()
                .then(user => {
                  // JWT Token
                  const token = jwt.sign({ userId: user.id }, APP_SECRET);
                  res.json({
                    token,
                    user
                  });
                })
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err.details[0].message));
};

module.exports = signup;
