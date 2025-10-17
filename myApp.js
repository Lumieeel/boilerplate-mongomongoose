require('dotenv').config();
const mongoose = require('mongoose');

// --- Conexión a MongoDB Atlas (desde .env) ---
if (!process.env.MONGO_URI) {
  console.log('⚠️  MONGO_URI no está definida');
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => console.log('✅ mongoose connected'));
mongoose.connection.on('error', (err) =>
  console.log('❌ mongoose connection error:', err.message)
);

// --- Schema & Model ---
let Person;

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

Person = mongoose.model('Person', personSchema);

// 1) Crear y guardar una persona
const createAndSavePerson = (done) => {
  const person = new Person({
    name: 'Juan',
    age: 20,
    favoriteFoods: ['completo'],
  });

  person.save((err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

// 2) Crear muchas personas con Model.create()
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return done(err);
    return done(null, people);
  });
};

// 3) Buscar por nombre
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

// 4) Buscar uno por comida
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

// 5) Buscar por _id
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

// 6) Edit clásico (find → push → save)
const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';

  Person.findById(personId, (err, person) => {
    if (err) return done(err);
    if (!person) return done(new Error('Persona no encontrada'));

    person.favoriteFoods.push(foodToAdd);

    person.save((err, updated) => {
      if (err) return done(err);
      return done(null, updated);
    });
  });
};

// 7) Update con findOneAndUpdate
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },
    { $set: { age: ageToSet } },
    { new: true },
    (err, updated) => {
      if (err) return done(err);
      return done(null, updated);
    }
  );
};

// 8) Borrar por id
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removed) => {
    if (err) return done(err);
    return done(null, removed);
  });
};

// 9) Borrar muchos (por nombre) — FCC usa remove() en este reto
const removeManyPeople = (done) => {
  const nameToRemove = 'Mary';

  Person.remove({ name: nameToRemove }, (err, result) => {
    if (err) return done(err);
    return done(null, result);
  });
};

// 10) Query chain
const queryChain = (done) => {
  const foodToSearch = 'burrito';

  Person.find({ favoriteFoods: foodToSearch })
    .sort('name')
    .limit(2)
    .select('-age')
    .exec((err, data) => {
      if (err) return done(err);
      return done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
