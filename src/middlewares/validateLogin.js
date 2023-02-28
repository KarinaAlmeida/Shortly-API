export default function validateLogin (loginSchema) {
    
    return (req, res, next)=> {
       
        const {error}= loginSchema.validate (req.body, {abortEarly: false})
        if (error) return res.status(400).send(error.message)  

        next();
    }
}