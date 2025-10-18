const { Client } = require('pg');

exports.handler = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const { sender, recipient, offeredMonkeys, requestedMonkeys } = JSON.parse(event.body);

    if (!sender || !recipient) {
      return { statusCode: 400, body: 'Sender and recipient required' };
    }

    // Fetch users and their IPs and roles
    const userRes = await client.query(
      'SELECT username, ip, role, monkeys FROM users WHERE username = ANY($1::text[])',
      [[sender.toLowerCase(), recipient.toLowerCase()]]
    );

    if (userRes.rowCount < 2) {
      await client.end();
      return { statusCode: 404, body: 'Sender or recipient not found' };
    }

    const users = {};
    userRes.rows.forEach((u) => {
      users[u.username] = u;
    });

    // Check IP match or sender admin
    const senderUser = users[sender.toLowerCase()];
    const recipientUser = users[recipient.toLowerCase()];

    if (senderUser.ip !== recipientUser.ip && senderUser.role !== 'admin') {
      await client.end();
      return {
        statusCode: 403,
        body: 'Trade allowed only between users on the same network or sender admin',
      };
    }

    // Validate monkeys ownership (simplified)
    // Here you’d check if sender owns offeredMonkeys, recipient owns requestedMonkeys

    // Execute trade: update monkeys arrays - simplified example
    // This demo skips full validation and error handling for brevity

    const senderMonkeys = new Set(senderUser.monkeys);
    const recipientMonkeys = new Set(recipientUser.monkeys);

    // Remove offered from sender, add requested
    offeredMonkeys.forEach((m) => senderMonkeys.delete(m));
    requestedMonkeys.forEach((m) => senderMonkeys.add(m));

    // Remove requested from recipient, add offered
    requestedMonkeys.forEach((m) => recipientMonkeys.delete(m));
    offeredMonkeys.forEach((m) => recipientMonkeys.add(m));

    // Update DB
    await client.query('UPDATE users SET monkeys = $1 WHERE username = $2', [
      Array.from(senderMonkeys),
      senderUser.username,
    ]);
    await client.query('UPDATE users SET monkeys = $1 WHERE username = $2', [
      Array.from(recipientMonkeys),
      recipientUser.username,
    ]);

    await client.end();

    return { statusCode: 200, body: 'Trade completed successfully' };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};

