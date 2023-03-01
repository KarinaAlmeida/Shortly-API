import {db} from "../database/database.connection.js";

function validateAuth () {
    
    return async (req, res, next) => {
        
        const { authorization } = req.headers
        const token = authorization?.replace("Bearer ", '')

        if (!token) return res.status(401).send("Informe o token!")
        try{

        const sessaoAberta= await db.query (`SELECT * FROM sessions WHERE "userToken"=$1;`, [token])
 
  
        if (sessaoAberta.rowCount===0) return res.status(401).send("Você não está logado! Entre antes de lançar dados!")

        res.locals.id= sessaoAberta.rows[0].userId
        
         next ();
        }catch (err){
        console.log(err)
        res.status(500).send("Deu algo errado no servidor")
        }
       
    }

 } 

 function validateUrl (urlSchema) {
    return (req, res, next)=> {
       
        const {error}= urlSchema.validate (req.body, {abortEarly: false})
        if (error) return res.status(422).send(error.message)  

        next();
    }
 }

 export {validateAuth, validateUrl}