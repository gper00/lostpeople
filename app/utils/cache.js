const NodeCache = require('node-cache');

// Buat instance cache dengan TTL standar 5 menit (300 detik)
// checkperiod menentukan seberapa sering cache akan memeriksa dan menghapus entri yang kedaluwarsa.
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

module.exports = cache;
