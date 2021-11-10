const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000

const { carikontak, ambilkontak } = require('./utils/contacts')

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))


app.get('/', (req, res) => {

    const mahasiswa = [{
            nama: 'fikri',
            email: 'fikri@gmail.com'
        },
        {
            nama: 'budi',
            email: 'budi@gmail.com'
        },
        {
            nama: 'dani',
            email: 'dani@gmail.com'
        },
    ]

    res.render('index', {
        layout: 'template/main-layout',
        title: 'Home',
        aktif: 1,
        nama: 'fikri',
        mahasiswa
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'template/main-layout',
        aktif: 3,
        title: 'About'
    })
})

app.get('/kontak', (req, res) => {
    const contacts = ambilkontak()

    res.render('kontak', {
        layout: 'template/main-layout',
        aktif: 2,
        title: 'kontak',
        contacts
    })
})

app.get('/kontak/:nama', (req, res) => {
    const contact = carikontak(req.params.nama)

    res.render('detail', {
        layout: 'template/main-layout',
        aktif: 2,
        title: 'Detail kontak',
        contact
    })
})


app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>Halaman tidak ditemukan !!!</h1>')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})