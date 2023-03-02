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
    const token = uuidV4();


        try {

            const existe = await db.query(`SELECT * FROM users WHERE email = $1;`, [email])
            
            if (existe.rowCount === 0) return res.status(401).send("Email ou Senha incorreta!")
        
            const {id, password:hash} = existe.rows[0]
            
            const senhaCorreta= bcrypt.compareSync(password, hash);
            
    
            if(!senhaCorreta){
             return res.status(401).send("Email ou Senha incorreta!")           
             }

            const sessaoAberta= await db.query (`SELECT * FROM sessions WHERE "userId"=$1;`, [id])

            if (sessaoAberta.rowCount >=1) {
                await db.query (`UPDATE sessions SET "userToken" = $1 WHERE "userId" = $2;`, [token, id])
            }else{
                await db.query (` INSERT INTO sessions("userId", "userToken")
                VALUES ($1, $2)
            `, [id, token]);
            
            }
            return res.status(200).send({token});

    
        } catch (err) {
            return res.status(500).send(err.message)
        }

}

async function userMe (req, res) {
    const userId= res.locals.id;
    
    try {
        const urls = await db.query(`
        SELECT url.id, url.short, url.url, url."visitCount"
        FROM url 
        WHERE "userId" = $1;`, [userId]);
        
        const ordemUrl= urls.rows.map((item) => {
            return {
                id:item.id,
                shortUrl: item.short,
                url: item.url,
                visitCount: item.visitCount
            }
        })

        const visitCountTotal = await db.query(`SELECT SUM ("visitCount") 
        AS visit 
        FROM url
        WHERE "userId" = $1;`, [userId])

        const usuario = await db.query(`SELECT * 
        FROM users 
        WHERE id=$1;`, [userId])

        return res.status(200).send({
            id: usuario.rows[0].id,
            name: usuario.rows[0].name,
            visitCount: visitCountTotal.rows[0].visit,
            shortenedUrls: ordemUrl                          
        })
        
    } catch (error) {
        return res.status(500).send(error.message)

    }
}

async function rank (req, res) {
    try {
        const rankeada = await db.query (` SELECT users.id, users.name,
        COUNT (url.url) AS "linksCount",
        SUM (url."visitCount") AS "visitCount"
        FROM url
        LEFT JOIN users ON url."userId" = users.id
        GROUP BY users.id, url."userId", users.name
        ORDER BY "visitCount" DESC
        LIMIT 10;` )
        

        return res.status(200).send(rankeada.rows);

    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

export {signUp, login, userMe, rank}