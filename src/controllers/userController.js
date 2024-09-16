const UserManager = require("../dao/classes/user.dao.js");
const upload = require("../middleware/multer.js");
const userService = new UserManager();
const { transport } = require("../middleware/mailer.js");

exports.getUsers = async (req, res) => {
  try {
    let users = await userService.getUsers();
    res.render("users", { users: users });
  } catch (error) {}
};
exports.getUser = async (req, res) => {
  let { uid } = req.params;
  try {
    let user = await userService.getUserById(uid);

    res.render("changeRol", { user: user});
  } catch (error) {}
};

exports.putRolUser = async (req, res) => {
  let { uid } = req.params;
  try {
    let user = await userService.getUserById(uid);
    if (user.rol === "premium") {
      const newRol = { rol: "user" };
      await userService.updateUserRol(user.email, newRol);
      let userActualizate = await userService.getUserById(uid);
      console.log(userActualizate);
      return res.status(202).json({ message: `Se ha cambiado el rol` });
    }
    if (user.rol === "user") {
      if (user.documents.length >= 3) {
        const newRol = { rol: "premium" };
        await userService.updateUserRol(user.email, newRol);
        let userActualizate = await userService.getUserById(uid);
        console.log(userActualizate);
        return res.status(202).json({ message: `Se ha cambiado el rol` });
      } else {
        return res.status(202).json({ message: `Falta cargar documentación` });
      }
    }
    if (user.rol === "admin")
      return res
        .status(202)
        .json({ message: "El administrador no puede cambiar el rol" });

    res.redirect(`/premium/${uid}`);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ocurrió un error al procesar la solicitud" });
  }
};

exports.getDocuments = async (req, res) => {
  const { uid } = req.params;
  res.render("documents", {
    user: req.session.user,
    id: uid,
  });
};

exports.postDocuments = async (req, res) => {
  const { uid } = req.params;
  let user = await userService.getUserById(uid);
  const idUser = { _id: uid };
  const documents = [];
  for (let fieldname in req.files) {
    req.files[fieldname].forEach((file) => {
      documents.push({
        name_document: fieldname,
        reference: file.filename,
      });
    });
  }
  if (user.documents.length === 3) {
    res.render("documents", {
      user: user,
      id: uid,
      message: "Ya se encuentra cargada toda la documentación",
    });
  }
  await userService.postDocuments(idUser, documents);
  res.render("documents", {
    user: req.session.user,
    id: uid,
    message: "Documentación cargada correctamente",
  });
};

exports.deleteInactive = async (req, res) => {
  const host = req.get("host");
  let users = await userService.getUsers();
  let today = new Date();
  let milisecondsPerDay = 1000 * 60 * 60 * 24;
  for (let user of users) {
    let diferenceInMiliseconds = new Date(user.last_connection) - today;
    let daysDiference = diferenceInMiliseconds / milisecondsPerDay;
    if (daysDiference >= 2 && user.rol != "admin") {
      let mail = await transport.sendMail({
        from: "n.buccafusca@outlook.com.ar",
        to: user.email,
        subject: "Cuenta eliminada",
        html: `  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title><style>
          body {
            width: 100%;
            display: flex;
            flex-direction: column;
          }

          h1 {
            background-color: black;
            width: 100%;
            color: white;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>CUENTA ELIMINADA</h1>
        <p>Hola ${user.first_name}!</p>
        <div>
          <p>Su cuenta fue eliminada por inactividad</p>
          <p>Registrese nuevamente <a href="http://${host}/login">click aquí</a><p>

        </div>
      </body>
      </html>
    `,
      });
      let userEmail = { email: user.email };
      await userService.deleteUser(userEmail);
    }
  }
  let actualizateUsers = userService.getUsers();
  res.send({ lista: actualizateUsers });
};

exports.deleteUser = async (req, res) => {
  const host = req.get("host");
  const { uid } = req.params;
  let user = await userService.getUserById(uid);
  try {
    if (user) {
      await userService.deleteUser({ email: user.email });
      res.status(200).json({ message: "Usuario eliminado" });
    } else {
      res.status(200).json({ message: "Usuario inexistente" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error de servidor" });
  }
};