export default function validateUser (usersSchema) {
    
    return (req, res, next)=> {
       
        const {error}= usersSchema.validate (req.body, {abortEarly: false})
        if (error) return res.status(400).send(error.message)  

        next();
    }
}