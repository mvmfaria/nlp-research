import dogs from '../../training/database/dog.json' assert { type: 'json' };
import fs from 'fs'

const breeds = [] 

for (let dog of dogs) {
    breeds.push(dog.title)
}

console.log(`Breeds: ${breeds.length}`)
console.log(breeds)

fs.writeFileSync('gazetteer.json', JSON.stringify(breeds));

