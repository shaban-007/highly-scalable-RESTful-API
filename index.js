const express = require('express')
const mysql = require('mysql2')

const db = mysql.createConnection({
    host        :   'localhost',
    user        :   'root',
    password    :   '1234',
    database    :   'mysqldb'
});

db.connect((err)=>{
    if(err){
        throw err;    
    }
    console.log("my sql connected");
})




const app = express();
app.use(express.json());


//validation

const validateAddPerson = [
    check('title').notEmpty().isString().trim(),
    check('body').notEmpty().isString().trim(),
  ];



  const validateUpdatePerson = [
    check('title').notEmpty().isString().trim(),
  ];


//create db

app.get('/createdb',(req,res)=>{
    let sql = 'CREATE DATABASE mysqldb';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('Database created');
    })
})

//create table

app.get('/createperosontable',(req,res)=>{
    let sql = 'CREATE TABLE person (id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255),body VARCHAR(255))';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send("Table Created")
    })
})



//insert data

app.get('/addperson',(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
     }
    let post = {title:'person One',body:'this is first person'}
    let sql = 'INSERT INTO PERSON SET ?';
    db.query(sql,post,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('person added')
    })
})



//read data

app.get('/getpersons',(req,res)=>{
    let sql = 'SELECT * FROM PERSON';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('persons fetched')
    })
})

//read data by id

app.get('/getpersons/:id',(req,res)=>{
    let sql = `SELECT * FROM PERSON WHERE id = ${req.params.id}`;
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('person fetched')
    })
})


//update data by id


app.get('/updateperson/:id',(req,res)=>{
    let new_Title = 'person two';
    let sql = 'UPDATE PERSON SET title = ? WHERE id = ?';
    db.query(sql, [new_Title, req.params.id], (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('person UPDATED')
    })
})


//delete data by id


app.get('/deleteperson/:id',(req,res)=>{
    let new_Title = 'person two';
    let sql = 'DELETE FROM PERSON WHERE id = ?';
    db.query(sql, req.params.id, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('person DELETED')
    })
})

//filter 


app.get('/getpersons', (req, res) => {
    const { page, pageSize, sortField, sortOrder, filterField, filterValue } = req.query;
    const offset = (page - 1) * pageSize || 0;
    const limit = pageSize || 10;
    let sql = 'SELECT * FROM person';
    if (filterField && filterValue) {
      sql += ` WHERE ${filterField} = ?`;
    }
  
    if (sortField && sortOrder) {
      sql += ` ORDER BY ${sortField} ${sortOrder}`;
    }
  
    sql += ' LIMIT ? OFFSET ?';
  
    db.query(sql, [filterValue, limit, offset], (err, results) => {
      if (err) {
        console.error('Error fetching persons:', err);
        return res.status(500).json({ error: 'An error occurred' });
      }
      res.json(results);
    });
  });


app.listen('3000',()=>{
    console.log('server start on 3000');
})

