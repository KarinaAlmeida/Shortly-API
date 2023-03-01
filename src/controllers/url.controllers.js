import {db} from "../database/database.connection.js";
import { nanoid } from 'nanoid'

async function shorten (req, res) {
    const userId= res.locals.id;
    const {url} = req.body


    try {
        const short = nanoid(6); 

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

export {shorten, getUrlId}