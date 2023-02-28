export default function validateUser (userSchema) {
    
    return (req, res, next)=> {
       
        const {error}= userSchema.validate (req.body, {abortEarly: false})
        if (error) return res.status(422).send(error.message)  

        next();
    }
}