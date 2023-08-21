const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res
    .status(200)
    .send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
          <form method="post">
            <div>
              <label for="subject">Subject</label>
              <input type="text" name="subject" id="subject" />
            </div>

            <div>
              <label for="body">Body</label>
              <textarea name="body" id="body"></textarea>
            </div>

            <button>Send</button>
          </form>
        </body>
      </html>`);
});

app.get('/status', (req, res) => {
  res
    .status(200)
    .json({ status: 'ok' });
});

app.post('/', async (req, res) => {
  const { subject, body } = req.body;

  if (!subject) {
    return res
      .status(422)
      .json({ error: 'A subject is required.' });
  }

  if (!body) {
    return res
      .status(422)
      .json({ error: 'A message body is required.' });
  }

  try {
    await fetch("https://api.val.town/v1/run/jakelundberg.sendEmail", {
      method: "POST",
      body: JSON.stringify({args: [subject, body]}),
      headers: { Authorization: `Bearer ${process.env.VAL_TOWN_API_TOKEN}` },
    });

    return res
      .status(200)
      .json({ status: 'ok' });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: 'Well this is awkward. Something seems to be have gone wrong while sending your email. Please try again later.' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`express app listening on port ${process.env.PORT}`);
});