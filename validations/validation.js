const Joi = require("@hapi/joi")

const signUp = (req, res, next) => {
  const validateSignup = Joi.object({
    firstName: Joi.string().min(3).max(40).trim().pattern(/^[a-zA-Z]+$/).required().messages({
      'string.empty': 'firstName cannot be empty',
      'string.min': 'Min 3 characters',
      'string.pattern.base': 'Numbers and space not accepted',
    }),

    lastName: Joi.string().min(3).max(40).trim().pattern(/^[a-zA-Z]+$/).required().messages({
      'string.empty': 'lastName cannot be empty',
      'string.min': 'Min 3 characters',
      'string.pattern.base': 'Numbers and space not accepted',
    }),

    email: Joi.string().email({ tlds: { allow: false } }).trim().required().messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Invalid email address',
      'any.required': 'Email is required'
    }),

    password: Joi.string().required().min(8).pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[\\d@$!%*?&])[A-Za-z\\d@$!%*-._?&]{8,}$')).messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.min': 'password is weak',
      'string.pattern.base': 'pattern must at least contain one number or special character.',
      'any.required': 'Password is required'
    }),

    phoneNumber: Joi.string().required().max(15).trim().messages({
      'string.base': 'phoneNumber must be a string',
      'string.empty': 'phoneNumber cannot be empty',
      'any.required': 'phoneNumber is required'
    })
})

  const {firstName, lastName, email, password, phoneNumber } = req.body

  const { error } = validateSignup.validate({firstName,lastName,email,password,phoneNumber}, { abortEarly: false })
  if (error) {
    const errors = error.details.map(detail => detail.message)
    
    // Send errors one by one
    for (const errorMessage of errors) {
    return res.status(400).json({ error: errorMessage })
    }
  }

  next()
}


const forgotValidation = (req, res, next) => {
  const validateforgot = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).trim().required().messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Invalid email address',
      'any.required': 'Email is required'
    })
  })

  const { email } = req.body

  const { error } = validateforgot.validate({email})
  if (error) {
    return res.status(400).json({
      error: error.details.map(detail => detail.message), 
    })
  }

  next()
}

const resetPasswordValidation = (req, res, next) => {
  const validatePassword = Joi.object({
    newPassword: Joi.string().required().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[\\d@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.pattern.base': 'Password must be at least 8 characters long, must contain at least one number or special character.',
      'any.required': 'Password is required'
    }),
  })

  const { newPassword } = req.body

  const { error } = validatePassword.validate({newPassword})
  if (error) {
    const errors = error.details.map(detail => detail.message)
    
    // Send errors one by one
    for (const errorMessage of errors) {
    return res.status(400).json({ error: errorMessage })
    }
  }

  next()
}


const changePasswordValidation = (req, res, next) => {
  const changePassword = Joi.object({
    currentPassword:  Joi.string().required().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[\\d@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.pattern.base': 'Password must be at least 8 characters long, must contain at least one number or special character.',
      'any.required': 'Password is required'
    }),
    newPassword:  Joi.string().required().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[\\d@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.pattern.base': 'Password must be at least 8 characters long, must contain at least one number or special character.',
      'any.required': 'Password is required'
    }),  
  })

  const { currentPassword, newPassword } = req.body

  const { error } = changePassword.validate({currentPassword,newPassword})

  if (error) {
    const errors = error.details.map(detail => detail.message)
    
    // Send errors one by one
    for (const errorMessage of errors) {
    return res.status(400).json({ error: errorMessage })
    }
  }

  next()
}

const loginValidation = (req, res, next) => {
  const login = Joi.object({
    email:  Joi.string().required().messages({
      'string.base': 'email must be a string',
      'string.empty': 'Enter your email',
      'any.required': 'email is required'
    }),
    password:  Joi.string().required().messages({
      'string.base': 'Password must be a string',
      'string.empty': 'input password',
      'any.required': 'input password'
    }),  
  })

  const { email, password } = req.body

  const { error } = login.validate({ email, password })

  if (error) {
    const errors = error.details.map(detail => detail.message)
    
    // Send errors one by one
    for (const errorMessage of errors) {
    return res.status(400).json({ error: errorMessage })
    }
  }

  next()
}


const transferPinValidation = (req, res, next) => {
  const transferPin = Joi.object({
    pin: Joi.string()
      .required().length(4).pattern(/^[0-9]{4}$/).messages({
        'string.base': 'PIN must be a string',
        'string.empty': 'Create a strong transaction Pin',
        'string.length': 'PIN must be exactly 4 digits',
        'string.pattern.base': 'PIN must contain only numbers',
        'any.required': 'Transfer PIN is required',
      }),
  })

  const { pin } = req.body

  const { error } = transferPin.validate({ pin })

  if (error) {
    const errors = error.details.map(detail => detail.message)
    
    // Send errors one by one
    for (const errorMessage of errors) {
    return res.status(400).json({ error: errorMessage })
    }
  }
  next()
}



const payment = (req, res, next) => {
  const validatePayment = Joi.object({
    recipientEmail: Joi.string().email({ tlds: { allow: false } }).trim().required().messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Invalid email address',
      'any.required': 'Email is required'
    }),

    amount: Joi.number().positive().required().messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be a positive number',
      'any.required': 'Input the amount to be sent'
    })
})

  const {recipientEmail, amount} = req.body

  const { error } = validatePayment.validate({recipientEmail, amount}, { abortEarly: false })
  if (error) {
    const errors = error.details.map(detail => detail.message)
    
    // Send errors one by one
    for (const errorMessage of errors) {
    return res.status(400).json({ error: errorMessage })
    }
  }

  next()
}



module.exports = {signUp, forgotValidation, payment, changePasswordValidation, resetPasswordValidation, loginValidation, transferPinValidation}