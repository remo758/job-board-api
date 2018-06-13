// get current profile
const getProfile = (Profile, jwt, APP_SECRET, getUserId) => (req, res) => {
  const userId = getUserId(req, res, jwt, APP_SECRET);
  Profile.findOne({ user: userId })
    .then(profile => {
      !profile && res.status(404).json("There is no profile for this user");
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
};

// add and update profile
const postProfile = (Profile, jwt, APP_SECRET, getUserId, Joi) => (
  req,
  res
) => {
  const userId = getUserId(req, res, jwt, APP_SECRET);
  const {
    firstName,
    lastName,
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
    firstName: Joi.string()
      .min(3)
      .max(60)
      .required(),
    lastName: Joi.string()
      .min(3)
      .max(60)
      .required(),
    jobTitle: Joi.string()
      .min(3)
      .max(60)
      .required(),
    img: Joi.string()
      .uri()
      .required(),
    website: Joi.string().uri(),
    linkedin: Joi.string().uri(),
    github: Joi.string().uri(),
    city: Joi.string()
      .min(3)
      .max(60),
    state: Joi.string()
      .min(3)
      .max(60),
    country: Joi.string()
      .min(3)
      .max(60)
  });

  Joi.validate(
    {
      firstName,
      lastName,
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
      firstName && (profileFields.firstName = firstName);
      lastName && (profileFields.lastName = lastName);
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
              new Profile(profileFields)
                .save()
                .then(profile => res.json(profile))
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err.details[0].message));
};

// get profile - params
const profile = Profile => (req, res) => {
  const { userId } = req.params;
  Profile.findOne({ user: userId })
    .then(profile => {
      !profile && res.status(404).json("There is no profile for this user");
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
};

// get all profiles
const profiles = Profile => (req, res) => {
  Profile.find()
    .then(profiles => {
      !profiles && res.status(404).json("There are no profiles");
      res.json(profiles);
    })
    .catch(err => res.status(404).json(err));
};

module.exports = { getProfile, postProfile, profile, profiles };
