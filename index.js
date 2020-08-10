require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const authMiddleware = require('./auth/middlewares');
const auth = require('./auth/index');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(authMiddleware.verifyTokenIdentifyUser);

app.get('/', (req, res) => {
    res.json({
        message: 'test test hehe'
    });
});

app.use('/auth', auth);
//app.use('')


const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})