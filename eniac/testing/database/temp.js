import fs from 'fs';
import dogs from './wikipedia.json' assert { type: 'json' };

for (let dog of dogs) {
    for (let img of dog.imgsLinks) {
        img.isdog = 1
    }
}

for (let dog of dogs) {
    for (let img of dog.imgsLinks) {
        console.log(img)
    }
}

fs.writeFileSync('./new_wikipedia.json', JSON.stringify(dogs, null, " "));