const Router = require('express').Router;
const db = require('../db/db');
const fs = require("fs");
const fastcsv = require("fast-csv");
const multer = require('multer')
const upload = multer();
const router = new Router();

router.post('/upload', async (req, res) => {
  if (!req.files || !req.files.file) throw new Error('no file uploaded');

  const uploadedFiles = req.files.file
  const {
    email,
    sub
  } = req.body;

  // console.log('Backend files:', uploadedFiles);
  // console.log('Backend email:',email);
  // console.log('Backend sub:',sub);
 
  let stream = fs.createReadStream(uploadedFiles.data);
  let csvData = [];
  let csvStream = fastcsv
    .parse()
    .on("data", function(data) {
      csvData.push(data);
    })
    .on("end", function() {
      // remove the first line: header
      csvData.shift();
      // console.log('#######','csvData', csvData);

      const query = "INSERT INTO heartrate_seconds_merged (id, time, value) VALUES ($1, $2, $3)";

      try {
        csvData.forEach(row => {
          db.query(query, [row.Id, row.time, row.value]);
          console.log("inserted " + res.rowCount + " row:", row);
        });
      } catch(error) {
        console.error(error);
      } finally {
        done();
      }
  });
  stream.pipe(csvStream);

  res.send('success');
});
  

 
//   fs.createReadStream('path/to/my.csv')
//   .pipe(csv.parse({ headers: true }))
//   .on('data', row => console.log(row))
//   let csvData = [];
//   let csvStream = fastcsv
//     .parse()
//     .on("data", function(data) {
//        csvData.push(data);
//     })
//      .on("end", function() {
//       // remove the first line: header
//        csvData.shift();
// console.log(csvData);
//       const query =
//          "INSERT INTO heartrate_seconds_merged (id, time, value) VALUES ($1, $2, $3)";
//       pool.connect((err, client, done) => {
//         if (err) throw err;
//         try {
//           csvData.forEach(row => {
//             client.query(query, row, (err, res) => {
//               if (err) {
//                 console.log(err.stack);
//               } else {
//                 console.log("inserted " + res.rowCount + " row:", row);
//               }
//             });
//           });
//         } finally {
//           done();
//         }
//       });
//     });
//   stream.pipe(csvStream);

router.post('/', async (req, res, next) => {
  console.log(req.body);
  const {
    name,
    email,
    sub
  } = req.body;

  try {
    let patient = await db.query('SELECT * FROM patients WHERE email=$1 AND sub=$2', [email, sub]);
    let doctor = await db.query('SELECT * FROM doctors WHERE email=$1 AND sub=$2', [email, sub]);

    if ((!doctor || doctor.rows.length === 0) // if not a doctor
      &&
      (!patient || patient.rows.length === 0)) { // and not a patient
      // insert into db as patient
      await db.query('INSERT INTO patients(name, email, sub, is_patient) VALUES($1, $2, $3, true)', [name, email, sub]);
      patient = await db.query('SELECT * FROM patients WHERE email=$1 AND sub=$2', [email, sub]);
      return res.json({
        msg: 'New patient saved',
        user: patient.rows[0]
      });
    }

    if (doctor && doctor.rows.length > 0) { //if a doctor
      return res.json({
        msg: 'A doctor found',
        user: doctor.rows[0]
      });
    }

    // default: return existing patient
    return res.json({
      msg: 'Existing patient found',
      user: patient.rows[0]
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error
    });
  }
});

module.exports = router;