const express = require('express');
const request = require('request');
require('dotenv').config();

const app = express();

//allows CORS specifically from our front end domain
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/search', async (req, res, next) => {
  const { q, type } = req.query;

  if (!q || !type) {
    return next({
      message: 'Bad request. Query paramters missing.',
      status: 400,
    });
  }

  //retrieve token
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
        ).toString('base64'),
    },
    form: {
      grant_type: 'client_credentials',
    },
    json: true,
  };

  request.post(authOptions, function(error, response, body) {
    if (error) {
      return next(error);
    }

    if (response.statusCode === 200) {
      //make request
      const token = body.access_token;
      const options = {
        url: `https://api.spotify.com/v1/search?q=${q}&type=${type}`,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        json: true,
      };
      request.get(options, function(error, response, body) {
        if (error) {
          return next(error);
        }

        if (response.statusCode === 200) {
          if (body.tracks && body.tracks.items) {
            return res.send(body.tracks.items);
          }

          if (body.albums && body.albums.items) {
            return res.send(body.albums.items);
          }

          if (body.playlists && body.playlists.items) {
            return res.send(body.playlists.items);
          }

          if (body.artists && body.artists.items) {
            return res.send(body.artists.items);
          }
        }
      });
    }
  });
});

//error handler
app.use((error, req, res, next) => {
  //protection by obfuscation
  console.error(error);
  return res.status(500).send({ success: false });
});

app.listen(process.env.PORT, () => {
  console.log('listening on port:', process.env.PORT);
});
