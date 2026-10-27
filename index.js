import express from express
import pg from 'pg'
import Joi from 'joi'

const app = express()
const port = 3000
const { Pool } = pg

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: '1234',
    port: 5432,
})

app.user(express.json())
app.use(express.urlencoded({ extended: true })) 

// Middleware 
app.use((req, res, next) =>{
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start
        console.log({
            method: req.method,
            url: req.originalUrl,
            statusCode: req.statusCode,
            duration: `${duration} ms`
        })
    })
    next()

}) 

// Response Envelope
function successResponse(res, message, data, status = 200){
    return res.status(status).json({
        success: true, 
        message, 
        data, 
        error: null,
    })
}

function errorResponse(res, message, status, details = null){
    return res.status(status).json({
        success: false, 
        message, 
        data:null, 
        error: details,
    })
}

//JOI VALIDATION
const biodataSchema = Joi.object({
    id: Joi.number().integer().positive(),
    nama: Joi.string().trim().min(2).max(100).required(),
    nim: Joi.string().trim().min(5).max(20).required(),
    kelas: Joi.string().trim().min(1).max(20).required(),
})

const idSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
})




