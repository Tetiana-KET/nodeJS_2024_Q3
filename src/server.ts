import { createServer } from 'node:http';
import { Routes } from './models/Routes';
import { HttpStatus } from './models/HttpStatus';
import { config } from 'dotenv';
import { ErrorMessages } from './models/ErrorMessages';
import { DEFAULT_DB_PORT, DEFAULT_PORT } from './consts/detaultPort';
import { AddressInfo } from 'node:net';
import { extractUserId } from './utils/extractUserId';
import { validateUserData } from './utils/validateUserData';
import { validateUserID } from './utils/validateUserID';
import { startDbService } from './dataBase/dbProcess';
config();

const DB_PORT = process.env.DB_PORT || DEFAULT_DB_PORT;
const dbServiceUrl = `http://localhost:${DB_PORT}/api/users`;

export const server = createServer((req, res) => {
  const address = server.address();
  const port = typeof address === 'string' ? 'unknown' : (address as AddressInfo).port;

  console.log(`Request handled by worker ${process.pid} on port ${port}`);
  try {
    if (req.method === 'POST' && req.url === Routes.USERS) {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        validateUserData(body)
          .then((data) => {
            fetch(dbServiceUrl, {
              method: 'POST',
              body: JSON.stringify(data),
              headers: { 'Content-Type': 'application/json' },
            })
              .then(async (dbRes) => {
                const user = await dbRes.json();
                res.writeHead(dbRes.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
              })
              .catch((err) => {
                res.writeHead(err.statusCode || HttpStatus.InternalServerError);
                res.end(JSON.stringify({ error: err.message }));
              });
          })
          .catch((err) => {
            res.writeHead(err.statusCode || HttpStatus.InternalServerError);
            res.end(JSON.stringify({ error: err.message }));
          });
      });
    } else if (req.method === 'GET' && req.url === Routes.USERS) {
      fetch(dbServiceUrl)
        .then((dbRes) => {
          res.writeHead(dbRes.status, { 'Content-Type': 'application/json' });
          return dbRes.json();
        })
        .then((users) => {
          res.end(JSON.stringify(users));
        })
        .catch((err) => {
          res.writeHead(err.statusCode || HttpStatus.InternalServerError);
          res.end(JSON.stringify({ error: err.message }));
        });
    } else if (req.method === 'GET' && req.url?.startsWith(Routes.USER_BY_ID)) {
      const userId = extractUserId(req) || '';
      fetch(`${dbServiceUrl}/${userId}`)
        .then((dbRes) => {
          res.writeHead(dbRes.status, { 'Content-Type': 'application/json' });
          return dbRes.json();
        })
        .then((user) => {
          res.end(JSON.stringify(user));
        })
        .catch((err) => {
          res.writeHead(err.statusCode || HttpStatus.InternalServerError);
          res.end(JSON.stringify({ error: err.message }));
        });
    } else if (req.method === 'DELETE' && req.url?.startsWith(Routes.USER_BY_ID)) {
      const userId = extractUserId(req) || '';
      validateUserID(userId)
        .then(() => {
          fetch(`${dbServiceUrl}/${userId}`, { method: 'DELETE' })
            .then(async (dbRes) => {
              const response = await dbRes.text();
              res.writeHead(dbRes.status, { 'Content-Type': 'application/json' });
              if (response) {
                res.end(response);
              } else {
                res.end();
              }
            })
            .catch((err) => {
              res.writeHead(err.statusCode || HttpStatus.InternalServerError);
              res.end(JSON.stringify({ error: err.message }));
            });
        })
        .catch((err) => {
          res.writeHead(err.statusCode || HttpStatus.InternalServerError);
          res.end(JSON.stringify({ error: err.message }));
        });
    } else if (req.method === 'PUT' && req.url?.startsWith(Routes.USER_BY_ID)) {
      const userId = extractUserId(req) || '';
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        validateUserData(body)
          .then((data) => {
            fetch(`${dbServiceUrl}/${userId}`, {
              method: 'PUT',
              body: JSON.stringify(data),
              headers: { 'Content-Type': 'application/json' },
            })
              .then(async (dbRes) => {
                const updatedUser = await dbRes.json();
                res.writeHead(dbRes.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedUser));
              })
              .catch((err) => {
                res.writeHead(err.statusCode || HttpStatus.InternalServerError);
                res.end(JSON.stringify({ error: err.message }));
              });
          })
          .catch((err) => {
            res.writeHead(err.statusCode || HttpStatus.InternalServerError);
            res.end(JSON.stringify({ error: err.message }));
          });
      });
    } else {
      res.writeHead(HttpStatus.NotFound, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ error: ErrorMessages.WrongEndpoint }));
    }
  } catch {
    res.writeHead(HttpStatus.InternalServerError, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ error: ErrorMessages.InternalServerError }));
  }
});

export function startServer(port: string, callback: () => void) {
  server.listen(port, callback);
}

export function stopServer(callback: () => void) {
  server.close(callback);
}

if (require.main === module) {
  const PORT = process.env.HOST_PORT || DEFAULT_PORT;
  startServer(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  startDbService(+DB_PORT);
}
