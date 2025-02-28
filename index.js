const express = require('express')
const app = express()
app.use(express.json())
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const cors = require('cors');
app.use(express.static('dist')) //necesario para que el minificado del frontend

app.use(morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body) // Agregar el cuerpo de la solicitud
    ].join(' ');
  }));
  

const date = () => {
    const today = new Date().toLocaleString("es-ES");
    return today
}

let persons = []

app.use(cors()); 

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (request, response) => {
    response.send(`
                    <div>
                        <p>date: ${date()}</p>
                        <p>contacts: ${persons.length}</p>
                    </div>
                `)
})  

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if(person){
        response.status(200).json(person)
    }else{
        response.status(404).end()
    } 
})

app.delete('/api/persons/:id',(request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body //sin json-parse body no estaría definido
    const addPerson = {
        id: uuidv4(),
        name: body.name,
        number: body.number
    }
    persons = [...persons, addPerson]; // Agrega a la lista
    if(body.name && body.number){
        response.status(201).json(addPerson);
    }else{
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
