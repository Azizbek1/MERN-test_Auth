const User = require('../models/User');

exports.read = (req, res, next) => {
    const userId = req.params.id
    User.findById(userId).exec((err, user) => {
        if(err || !user) {
            return res.status(404).json({
                error: 'User not found'
            })
        }
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user);
    })
}

exports.update = (req, res, next) => {
    const {name, password} = req.body
    User.findOne({_id: req.user._id}, (err, user) => {
        if(err || !user) {
            return res.status(404).json({
                error: 'Пользователь не найден'
            })
        }
        if(!name) {
            return res.status(404).json({
                error: 'Укажите имя'
            })
        }else{
            user.name = name
        }
        if(password) {
            if(password.length < 6) {
                return res.status(404).json({
                    error: 'Пароль должен состоять минимум из 6 символов'
                })
            }else{
                user.password = password
            }
        }
        user.save((err, updateUSer) => {
            if(err) {
                return res.status(404).json({
                    error: 'Ошибка обновления пользователя'
                })
            }
            updateUSer.hashed_password = undefined
            updateUSer.salt = undefined
            res.json({
                updateUSer
            })
        })
    })
   
}