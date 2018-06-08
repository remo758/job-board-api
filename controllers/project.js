// add  project
const postProject = (Project, jwt, APP_SECRET, getUserId, Joi) => (
  req,
  res
) => {
  const userId = getUserId(req, res, jwt, APP_SECRET);
  const { title, img, url } = req.body;

  // validation
  const schema = Joi.object().keys({
    title: Joi.string()
      .min(3)
      .max(60)
      .required(),
    img: Joi.string()
      .uri()
      .required(),
    url: Joi.string()
      .uri()
      .required()
  });

  Joi.validate({ title, img, url }, schema)
    .then(() => {
      const projectFields = { user: userId, title, img, url };
      // create profile
      new Project(projectFields)
        .save()
        .then(project => res.json(project))
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err.details[0].message));
};

// update project
const updateProject = (Project, jwt, APP_SECRET, getUserId, Joi) => (
  req,
  res
) => {
  const userId = getUserId(req, res, jwt, APP_SECRET);
  const { id } = req.params;
  const { title, img, url } = req.body;
  const projectFields = { user: userId, title, img, url };
  Project.findOne({ _id: id }).then(project => {
    !project && res.status(400).json("No Project");
    Project.findOneAndUpdate(
      { _id: id },
      { $set: projectFields },
      { new: true }
    )
      .then(project => res.json(project))
      .catch(err => res.status(400).json(err));
  });
};
module.exports = { postProject, updateProject };
