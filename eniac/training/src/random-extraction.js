const {launch} = require('puppeteer');
const fs = require('fs');

(async () => {

    const browser = await launch( { headless : false } );
    const page = await browser.newPage();

    //Lista com objetos contendo (parágrafo, url, titulo) apenas?
    randomContent = []

    //Estamos supondo que temos 10 racas.
    let i = 0;
    while (i < 10) {
        
        //Navega até uma página aleatório.
        await page.goto('https://en.wikipedia.org/wiki/Special:Random');

        //Será que sempre vai ter um parágrafo? Serão sempre em inglês?
        const url = page.url();
        const title = await page.title();
        const firstParagraph = await page.$eval('p', el => el.textContent);

        //Adiciona um objeto (url, title, paragraph) na lista.
        randomContent.push({'url': url, 'title': title, 'paragraph': firstParagraph})

        //Cria arquivo .json a partir da lista que foi gerada.
        fs.writeFileSync('./database/random.json', JSON.stringify(randomContent, null, " "));

        i++;
    }
  
    // Aqui você pode interagir com a nova página
    await browser.close();

})();
