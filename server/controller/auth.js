const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const sgMail = require("@sendgrid/mail");
const { validationResult } = require("express-validator");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// exports.signup = (req, res) => {
//   const { name, password, email } = req.body;
//   console.log(name, password);
//   User.findOne({ name }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: "электронная почта занята",
//       });
//     }
//   });
//   const newUser = new User({ name, password, email });
//   newUser.save((err, success) => {
//     if (err) {
//       return res.status(400).json({
//         error: err,
//       });
//     }
//     res.json({
//       message: `успешная регистрация ${success.name}`,
//       user: newUser,
//     });
//   });
// };
exports.signup = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: `Некоректный запрос`, errors });
    }
    const { name, password, email } = req.body;
    console.log(name, password);
    User.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error: "электронная почта занята",
        });
      }
      const token = jwt.sign(
        { name, email, password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        { expiresIn: "10m" }
      );
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `ссылка для активации аккаунта`,
        html: `
                  <h1>  Пожалуйста, используйте следующую ссылку, чтобы активировать свою учетную запись </h1>
                  <a  href="${process.env.CLIENT_URL}/auth/activate/${token}">Жми сюда чтобы активировать</a>
                  <hr>
                  <p>Это письмо может содержать конфиденциальную информацию</p>
                  <p>${process.env.CLIENT_URL} </p>
              `,
      };
      sgMail.send(emailData).then((sent) => {
        return res.json({
          message: `Электронная почта была отправлена ​​на ${email} Следуйте инструкциям, чтобы активировать вашу учетную запись`,
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.accountActivation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: `Некоректный запрос`, errors });
  }
  const { token } = req.body;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log(`JWT проверить в ошибке активации учетной записи`, err);
          res.status(401).json({
            error:
              "Ссылка с истекшим сроком действия. Зарегистрироваться снова",
          });
        }
        const { name, email, password } = jwt.decode(token);
        const user = new User({ name, email, password });
        user.save((err, user) => {
          if (err) {
            console.log(
              `Сохранить пользователя при ошибке активации учетной записи`
            );
            return res.status(401).json({
              error: `ошибка сохранения пользователя в базе данных. Попробуйте зарегистрироваться еще раз`,
            });
          }
          return res.json({
            message: `Успех регистрации. Пожалуйста войдите`,
          });
        });
      }
    );
  } else {
    return res.json({
      message: `Что-то пошло не так. Попробуйте снова`,
    });
  }
};
exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: `Некоректный запрос`, errors });
  }
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: `пользователь с таким адресом электронной почты существует Пожалуйста, зарегистрируйтесь`,
      });
    }
    // authenticate
    if (!user.authticate(password)) {
      return res.status(400).json({
        error: `Электронная почта и пароль не совпадают`,
      });
    }
    // generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err) {
      return res.status(404).json({
        error: "Ошибка обновления пользователя",
      });
    }
    if (user.role != "admin") {
      return res.status(404).json({
        error: "Админ ресурс. Доступ запрещен",
      });
    }
    req.profile = user;
    next();
  });
};
