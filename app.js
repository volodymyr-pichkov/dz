const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'pug');

app.get('/favicon.png', (req, res) => res.sendFile(path.join(__dirname, 'public', 'favicon.png')));

app.get('/', (req, res) => {
    const theme = req.cookies.theme || 'default';
    res.render('index', { theme });
});

app.post('/set-theme', (req, res) => {
    const { theme } = req.body;
    res.cookie('theme', theme, { httpOnly: true });
    res.redirect('/');
});

app.post('/register', (req, res) => {
    const user = { username: req.body.username };
    const token = jwt.sign(user, 'secretkey', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.send('User registered');
});

app.get('/protected', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).send('Access denied.');

    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        res.send('Protected content');
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
