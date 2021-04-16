const express = require('express');
const app = express()
const jwt = require('jsonwebtoken');

app.use(express.json())


app.post('/api/signup', (req, res) => {
    const { id, username, password } = req.body;
    jwt.sign(id, 'secret_key', (err, token) => {
        if (err) {
            res.status(400).send({ msg: err })
        } else {
            res.json({ token })
        }
    })
})


function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(403);
    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.sendStatus(404);
        req.user = user;
        next();
    });
}

//Finalizar la sesion enviando como nuevo token uno vacio que expirara en un segundo
app.put('/api/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
        if (logout) return res.send('Session finalized')
        else { res.send({ msg: err }) }
    })
})

app.get('/', verifyToken, (req, res) => {
    res.send('Hello User')
})

app.post('/api/login', verifyToken, (req, res) => {
    res.json({ msge: 'Exito' })
})


app.listen(4000, (req, res) => {
    console.log('server on port 4000');
})