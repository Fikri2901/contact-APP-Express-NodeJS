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


module.exports = { ambilkontak, carikontak }