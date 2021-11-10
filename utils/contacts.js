const fs = require('fs');

const path = './data'
if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
}

const data = './data/contact.json';
if (!fs.existsSync(data)) {
    fs.writeFileSync(data, '[]', 'utf-8');
}

const ambilkontak = () => {
    const filebuffer = fs.readFileSync('data/contact.json', 'utf-8');
    const contacts = JSON.parse(filebuffer);
    return contacts
}

const carikontak = (nama) => {
    const contacts = ambilkontak();
    const cari = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
    return cari
}

const SimpanKontak = (contacts) => {
    fs.writeFileSync('data/contact.json', JSON.stringify(contacts))
}

const tambahKontak = (contact) => {
    const contacts = ambilkontak()
    contacts.push(contact)
    SimpanKontak(contacts)
}

const cekDuplikat = (nama) => {
    const contacts = ambilkontak();
    const cari = contacts.find((contact) => contact.nama == nama)
    return cari
}


module.exports = { ambilkontak, carikontak, tambahKontak, cekDuplikat }