const getProfile = (Profile, jwt, APP_SECRET, getUserId) => (req, res) => {
  const userId = getUserId(req, res, jwt, APP_SECRET);
  Profile.findOne({ user: userId })
    .populate("user", "name")
    .then(profile => {
      !profile && res.status(404).json("There is no profile for this user");
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
};

const postProfile = (Profile, jwt, APP_SECRET, getUserId, Joi) => (
  req,
  res
) => {
  const userId = getUserId(req, res, jwt, APP_SECRET);
  const {
    username,
    jobTitle,
    img,
    website,
    linkedin,
    github,
    city,
    state,
    country
  } = req.body;

  // validation
  const schema = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(40)
      .required(),
    jobTitle: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    img: Joi.string()
      .uri()
      .required(),
    website: Joi.string().uri(),
    linkedin: Joi.string().uri(),
    github: Joi.string().uri(),
    city: Joi.string()
      .alphanum()
      .min(3)
      .max(40),
    state: Joi.string()
      .alphanum()
      .min(3)
      .max(40),
    country: Joi.string()
      .alphanum()
      .min(3)
      .max(40)
  });

  Joi.validate(
    {
      username,
      jobTitle,
      img,
      website,
      linkedin,
      github,
      city,
      state,
      country
    },
    schema
  )
    .then(() => {
      const profileFields = {};
      profileFields.user = userId;
      username && (profileFields.username = username);
      jobTitle && (profileFields.jobTitle = jobTitle);
      img && (profileFields.img = img);
      profileFields.links = {};
      website && (profileFields.links.website = website);
      linkedin && (profileFields.links.linkedin = linkedin);
      github && (profileFields.links.github = github);
      profileFields.location = {};
      city && (profileFields.location.city = city);
      state && (profileFields.location.state = state);
      country && (profileFields.location.country = country);

      Profile.findOne({ user: userId })
        .then(profile => {
          profile
            ? // Update
              Profile.findOneAndUpdate(
                { user: userId },
                { $set: profileFields },
                { new: true }
              )
                .then(profile => res.json(profile))
                .catch(err => res.status(400).json(err))
            : // Create
              // Check if username exists
              Profile.findOne({ username })
                .then(profile => {
                  profile && res.status(400).json("username already exists");
                  // Save Profile
                  new Profile(profileFields)
                    .save()
                    .then(profile => res.json(profile))
                    .catch(err => res.status(400).json(err));
                })
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
};

const profile = Profile => (req, res) => {
  const { username } = req.params;
  Profile.findOne({ username })
    .populate("user", "name")
    .then(profile => {
      !profile && res.status(404).json("There is no profile for this user");
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
};

const profiles = Profile => (req, res) => {
  Profile.find()
    .populate("user", "name")
    .then(profiles => {
      !profiles && res.status(404).json("There are no profiles");
      res.json(profiles);
    })
    .catch(err => res.status(404).json(err));
};

module.exports = { getProfile, postProfile, profile, profiles };
