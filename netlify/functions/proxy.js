const fetch = require('node-fetch');
exports.handler = async (event) => {
  const backendUrl = "https://bh.directsolutions.store";
  const clientIp = event.headers['x-nf-client-connection-ip'] || '127.0.0.1';
  const targetUrl = backendUrl + event.path;
  const forwardHeaders = {
    ...event.headers,
    'Host': new URL(backendUrl).hostname,
    'X-Forwarded-For': clientIp,
  };
  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: forwardHeaders,
      body: event.body,
      redirect: 'manual'
    });
    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text(),
    };
  } catch (error) {
    return {
      statusCode: 502,
      body: "Bad Gateway: Error connecting to the backend server."
    };
  }
};