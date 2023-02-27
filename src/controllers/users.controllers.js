import {db} from "../database/database.connection.js";
import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid'


async function signUp (req, res) {
    const { name, email, password } = req.body;

    const jaExiste= await db.query(`SELECT * FROM users WHERE email = $1;`, [email])
    if (jaExiste.rowCount >0) return res.status(409).send("Cliente já cadastrado no sistema!")

  

    const hashPassword = bcrypt.hashSync(password, 10);

    try {
        await db.query (`INSERT INTO users 
        (name, email, password) 
        VALUES ($1, $2, $3);`, [name, email, hashPassword]);

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

async function login (req,res){
    const {email, password } = req.body;
    


        try {

        const {authorization} = req.headers; 
        const tokenExiste = authorization?.replace("Bearer", "");
         if (!tokenExiste){
            return res.sendStatus(401)
         }

         const temToken= await db.query (`SELECT * FROM sessions WHERE token= $1;`, [tokenExiste] )

         if (temToken.rowCount===0) {
            return res.sendStatus(401)
         }
        

            const existe = await db.query(`SELECT * FROM users WHERE email = $1;`, [email])
    
            if (existe.rowCount === 0) return res.status(401).send("Email ou Senha incorreta!")
        
            const senhaCorreta= bcrypt.compareSync(password, existe.password);
    
            if(!senhaCorreta){
             return res.status(401).send("Email ou Senha incorreta!")           
             }

            const token = uuidV4();

            const sessaoAberta= await db.query (`SELECT * FROM sessions WHERE id=$1;`, [existe.id])

            if (sessaoAberta.rowCount >=1) {
                await db.query (``)
            }
    
        } catch (err) {
            console.log(err)
            return res.sendStatus(500)
        }

}


export {signUp, login}