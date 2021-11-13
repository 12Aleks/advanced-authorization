module.exports = class UserDto{
    email;
    id;
    isActivated;

    constructor(model){
        this.email = model.email;
        this.id = model._id; //mongoDb dobawlajet nizneje podczorkiwanie k id => _id my jego udalajem i
        //peredajom dalsze kak id
        this.isActivated = model.isActivated;
    }
}