import {db} from "../database/database.connection.js";
import { customAlphabet } from 'nanoid'

async function shorten (req, res) {
    const userId= res.locals.id;
    const {url} = req.body


    try {
       
        const nanoid = customAlphabet("abcdefghijklmnopqrstuvxywz1234567890", 6)
        const short= nanoid()
        const urlId = await db.query (`INSERT INTO url (url, "userId", short) VALUES ($1, $2, $3) RETURNING id;`, [url, userId, short])
       

        res.status(201).send({id: urlId.rows[0].id, shortUrl:short})
    } catch (error) {
        return res.status(500).send(error.message)
        
    }
}

async function getUrlId (req, res) {
    const urlId = req.params.id;

    try {
       const resposta=  await db.query (`SELECT * from url WHERE id=$1;`, [urlId])

       if (resposta.rowCount===0) {
        return res.status(404).send("Ops, não encontramos essa url!")
       }
       
       const objectUrl= resposta.rows[0];
    

       res.status(200).send({id:objectUrl.id, shortUrl:objectUrl.short, url:objectUrl.url})
    } catch (error) {
        return res.status(500).send(error.message)

    }


}

async function open (req, res) {
    const short= req.params.shortUrl

    try {
        const urlOriginal= await db.query( `SELECT * FROM url WHERE short=$1;`, [short])
        if (urlOriginal.rowCount === 0) return res.status(404).send("ops, Url não encontrada!")
        
        const visita = urlOriginal.rows[0].visitCount +1
        await db.query( `UPDATE url SET "visitCount"= $1 WHERE short=$2;`, [visita, short] )

       res.redirect(urlOriginal.rows[0].url)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

async function deleteUrl (req, res) {
    const userId= res.locals.id;
    const id = req.params.id;

    try {

        const urlSelec = await db.query(`SELECT * FROM url WHERE id=$1;`, [id]);

        if (urlSelec.rowCount === 0) return res.status(404).send("Epa! Não encontramos essa URL!")

        if(userId !== urlSelec.rows[0].userId) {
            return res.status(401).send("Essa URL não te pertence, colega! Não pode deletá-la!")

        }else{
        await db.query(`
            DELETE FROM url WHERE id = $1`, [id]);
        }

        return res.status(204).send("URL deletada!");
       

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export {shorten, getUrlId, open, deleteUrl}