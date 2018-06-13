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
      // create project
      new Project(projectFields)
        .save()
        .then(project => res.json(project))
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err.details[0].message));
};

// remove project
const removeProject = (Project, jwt, APP_SECRET, getUserId) => (req, res) => {
  const userId = getUserId(req, res, jwt, APP_SECRET);
  const { id } = req.params;
  Project.find({ user: userId })
    .then(projects => {
      !projects[0]
        ? res.status(404).json("There are no projects for this user")
        : Project.findOneAndRemove({ _id: id })
            .then(() => res.json("done"))
            .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
};

// get all projects for user params
const projects = Project => (req, res) => {
  const { userId } = req.params;
  Project.find({ user: userId })
    .then(projects => {
      !projects[0] &&
        res.status(404).json("There are no projects for this user");
      res.json(projects);
    })
    .catch(err => res.status(404).json(err));
};

// get all projects for current user
const getProjects = (Project, jwt, APP_SECRET, getUserId) => (req, res) => {
  const userId = getUserId(req, res, jwt, APP_SECRET);
  Project.find({ user: userId })
    .then(project => {
      !project[0] &&
        res.status(404).json("There are no projects for this user");
      res.json(project);
    })
    .catch(err => res.status(404).json(err));
};

module.exports = { postProject, removeProject, projects, getProjects };
