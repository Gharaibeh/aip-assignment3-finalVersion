// Input checks 

// email check if null or doesnt containt @
exports.email = function (req,required) {
    if(!req.query.Email && required) {
        return Promise.resolve({Error: "Parameter (Email) is required"})
    } else {
        if (req.query.Email) {
            if (req.query.Email.search(/@/) == -1) {
            //if (req.query.Email.search(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/) == -1) {
                return Promise.resolve({Error: "Parameter (Email) is wrong"})
            }
        }
    }

    return null;
}

// check the password if it is not on the app standards (8 characters min with a special char)
exports.password = function (req,required) {
    if(!req.query.Password && required) {
        return Promise.resolve({Error: "Parameter (Password) is required"})
    } else {
        if (req.query.Password) {
            if (req.query.Password.search(/(?=^.{8,}$)/) == -1) {
                return Promise.resolve({
                    Error: "Parameter (Password) is to short, minimum 8 symbols"
                })
            }
        }
    }

    return null;
}

//check the input parameter if it's Admin, Doctor or Patient
exports.type = function (req,required) {
    if(!req.query.Type && required) {
        return Promise.resolve({Error: "Parameter (Type) is required"})
    } else {
        if (req.query.Type) {
            if (req.query.Type != UserType.Type[0] && req.query.Type != UserType.Type[1] && req.query.Type != UserType.Type[2]) {
                return Promise.resolve({Error: "Parameter (Type) is wrong ,must be one of this['Admin','Doctor','Patient'])"})
            }
        }
    }

    return null;
}

exports.gender = function (req,required) {
    if(!req.query.Gender && required) {
        return Promise.resolve({Error: "Parameter (Gender) is required"})
    } else {
        if (req.query.Gender) {
            if (req.query.Gender != 'Male' && req.query.Gender != 'Female') {
                return Promise.resolve({Error: "Parameter (Gender) is wrong ,must be one of this['Male','Female'])"})
            }
        }
    }

    return null;
}

exports.date = function (req,required) {
    if(!req.query.DateOfBirth && required) {
        return Promise.resolve({Error: "Parameter (DateOfBirth) is required"})
    } else {
        if (req.query.DateOfBirth) {
            if (req.query.DateOfBirth.search(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)== -1) {
                return Promise.resolve({Error: "Parameter (DateOfBirth) is wrong ,must be like this (2009-05-28)"})
            }
        }
    }

    return null;
}

exports.time = function (req,required) {// time of meeting with the doctor
    if(!req.query.Date && required) {
        return Promise.resolve({Error: "Parameter (Date) is required"})
    } else {
        if (req.query.Date) {
            if (req.query.Date.search(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{1,2}:[0-9]{2}/)== -1) {
                return Promise.resolve({Error: "Parameter (Date) is wrong ,must be like this (2009-05-28T18:45)"})
            }
        }
    }

    return null;
}