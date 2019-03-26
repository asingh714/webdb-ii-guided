const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/roles.db3"
  },
  debug: true
};

const db = knex(knexConfig);

const router = require("express").Router();

router.get("/", (req, res) => {
  // returns a promise that resolves to all records in the table
  db("roles")
    .then(roles => {
      res.status(200).json(roles);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db("roles")
    .where({ id })
    .first() // because we want the first item in the array.
    .then(role => {
      res.status(200).json(role);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/", (req, res) => {
  const role = req.body;

  // get back an array with the last id generated.
  db("roles")
    .insert(role)
    .then(ids => {
      const id = ids[0];
      db("roles")
        .where({ id })
        .first() // because we want the first item in the array.
        .then(role => {
          res.status(201).json(role);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    });
});


router.put("/:id", (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  db("roles").where({ id })
  .update(changes)
  .then(count => {
    if (count > 0 ) {
      res.status(200).json(count);
    } else {
      res.status(404).json({ message: "Record not found." })
    }
  })
  .catch(error => {
    res.status(500).json(error);
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db("roles")
    .where({ id })
    .del()
    .then(count => {
      if (count > 0 ) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Record not found." })
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
