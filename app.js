const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000
const { body, validationResult, check } = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const { carikontak, ambilkontak, tambahKontak, cekDuplikat, hapusKontak, updateKontak } = require('./utils/contacts')

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())


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
        contacts,
        msg: req.flash('msg')
    })
})

app.post('/kontak',
    body('nama', 'Nama tidak boleh kosong !!').notEmpty().custom((value) => {
        const duplikat = cekDuplikat(value)
        if (duplikat) {
            throw new Error('Nama kontak sudah digunakan !!')
        }
        return true
    }),
    body('email', 'Email tidak valid !!').isEmail(),
    body('nomor', 'Nomor Telephone tidak valid !!').isMobilePhone('id-ID'),
    (req, res) => {
        const contacts = ambilkontak()
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render('kontak', {
                layout: 'template/main-layout',
                aktif: 2,
                title: 'kontak',
                contacts,
                msg: req.flash('msg'),
                errors: errors.array()
            })
        } else {
            tambahKontak(req.body)
            req.flash('msg', 'Data Berhasil ditambahkan !!')
            res.redirect('/kontak')
        }

    })

app.post('/kontak/update',
    body('nama', 'Nama tidak boleh kosong !!').notEmpty().custom((value, { req }) => {
        const duplikat = cekDuplikat(value)
        if (value !== req.body.oldnama && duplikat) {
            throw new Error('Nama kontak sudah digunakan !!')
        }
        return true
    }),
    body('email', 'Email tidak valid !!').isEmail(),
    body('nomor', 'Nomor Telephone tidak valid !!').isMobilePhone('id-ID'),
    (req, res) => {
        const contacts = ambilkontak()
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render('kontak', {
                layout: 'template/main-layout',
                aktif: 2,
                title: 'kontak',
                contacts,
                msg: req.flash('msg'),
                errors: errors.array(),
                contact: req.body
            })
        } else {
            updateKontak(req.body)
            req.flash('msg', 'Data Berhasil diupdate !!')
            res.redirect('/kontak')
        }

    })

app.get('/kontak/delete/:nama', (req, res) => {
    const contact = carikontak(req.params.nama)
    if (!contact) {
        res.status(404)
        res.send('<h1>404</h1>')
    } else {
        hapusKontak(req.params.nama)
        req.flash('msg', 'Data berhasil dihapus !!')
        res.redirect('/kontak')
    }
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