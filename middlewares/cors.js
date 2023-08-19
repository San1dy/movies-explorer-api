const allowedCors = [
  'localhost:3000',
  'san1dy.nomoredomains.xyz',
  'https://san1dy.nomoredomains.xyz',
  'http://san1dy.nomoredomains.xyz',
  'https://localhost:3000/',
  'http://localhost:3000/',
  'https://api.san1dy.nomoredomains.xyz',
  'http://api.san1dy.nomoredomains.xyz',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  next();
};