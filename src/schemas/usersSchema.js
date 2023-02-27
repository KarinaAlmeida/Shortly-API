import joi from "joi";

export const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.ref('password'),
      });



      export const userLoginSchema = joi.object({
        email: joi.string().email().required(),
        senha: joi.string().required(),
      });