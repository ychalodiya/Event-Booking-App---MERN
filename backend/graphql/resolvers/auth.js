const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user');

module.exports =  {
    createUser: (args) => {
        return userModel
        .findOne({
            email: args.inputUser.email
        })
        .then(user => {
            if(user) {
                throw new Error('User Exists already')
            }
            return bcrypt.hash(args.inputUser.password, 12)
        })
        .then((hashedPassword) => {
            const user = new userModel({
                email: args.inputUser.email,
                password: hashedPassword
            });
            return user.save();
        })
        .then((result) => {
            return {...result._doc, password: null, _id: result.id}
        })
        .catch(err => {
            throw err
        })
    },
    login: async ({email, password}) => {
        const user = await userModel.findOne({email: email});
        if(!user) {
            throw new Error('User does not exists.')
        }
       
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual) {
            throw new Error('You have entered the wrong password.');
        }
        
        const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', { expiresIn: '1h' });

        return { userID: user.id, token: token, tokenExpiration: 1}
    }
};