const { Client } = require('pg');

exports.handler = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const { username } = JSON.parse(event.body);
    if (!username) {
      return { statusCode: 400, body: 'Username is required' };
    }

    // Clean username
    const cleanUsername = username.trim().toLowerCase();

    // Check if username already exists
    const res = await client.query('SELECT id FROM users WHERE username = $1', [cleanUsername]);
    if (res.rowCount > 0) {
      await client.end();
      return { statusCode: 409, body: 'Username already taken' };
    }

    // Get user IP from request
    const userIP = event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || 'unknown';

    // Assign role based on username
    const role = cleanUsername === 'floto' ? 'admin' : 'user';

    // Insert new user with zero rebirths and empty monkey list
    await client.query(
      'INSERT INTO users(username, ip, role, rebirths, monkeys, equipped_monkey) VALUES ($1, $2, $3, 0, $4, $5)',
      [cleanUsername, userIP, role, '{}', null]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ username: cleanUsername, role }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};

