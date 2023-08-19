const allowedCors = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://san1dy.nomoredomains.xyz',
  'https://api.san1dy.nomoredomains.xyz',
];

function handleCors(req, res, next) {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
  }

  if (req.method === 'OPTIONS') {
    handleOptionsRequest(req, res);
    return;
  }

  next();
}

function handleOptionsRequest(req, res) {
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  res.setHeader('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  res.setHeader('Access-Control-Allow-Headers', requestHeaders);
  res.end();
}

module.exports = handleCors;
