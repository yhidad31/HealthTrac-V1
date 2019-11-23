const Router = require('express').Router;
const db = require('../db/db');
const fs = require("fs");
const fastcsv = require("fast-csv");
const multer = require('multer')
const upload = multer();
const router = new Router();

router.post('/upload', (req, res) => {
  console.log('Test',req.files.file);
  res.send('success')
  // const uploadedFiles = req.data.files
  // const {
  //   email,
  //   sub
  // } = req.body;

  // if (!req.files || !req.files.file) throw new Error('no file uploaded');
  // if (!uploadedFiles) throw new Error('no file uploaded');
  
  // console.log(uploadedFiles, email, sub);
});
  

//   let stream = fs.createReadStream("bezkoder.csv"); //to do: change this into input files
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
//       // const query =
//       //    "INSERT INTO category (id, time, value) VALUES ($1, $2, $3)";

//     //   pool.connect((err, client, done) => {
//     //     if (err) throw err;

//     //     try {
//     //       csvData.forEach(row => {
//     //         client.query(query, row, (err, res) => {
//     //           if (err) {
//     //             console.log(err.stack);
//     //           } else {
//     //             console.log("inserted " + res.rowCount + " row:", row);
//     //           }
//     //         });
//     //       });
//     //     } finally {
//     //       done();
//     //     }
//     //   });
//     // });

//   stream.pipe(csvStream);
// });

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