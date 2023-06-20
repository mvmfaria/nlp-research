import { launch } from 'puppeteer';
import fs from 'fs';
import dogs from '../database/dog.json' assert { type: 'json' };

(async () => {

    const browser = await launch( { headless : false } );
    const page = await browser.newPage();

    const randomContent = []
    const urlsDogs = []

    //Cria lista de urls.
    for (let obj of dogs) {
        urlsDogs.push(obj.url)
    }
    
    let i = 0;
    while (i < urlsDogs.length) {
        
        //Navega até uma página aleatório.
        await page.goto('https://en.wikipedia.org/wiki/Special:Random');
        const url = page.url();

        if (!urlsDogs.includes(url)) {

            const title = await page.title();

            const firstParagraph = await page.$$eval('p:not(.mw-empty-elt)', paragraphs => {
                if (paragraphs.length === 0 ) {
                    return null
                } else {
                    return paragraphs[0].textContent
                }
            })

            if (firstParagraph.length > 250 && firstParagraph != null) {

                //Adiciona um objeto (url, title, paragraph) na lista.
                randomContent.push({'url': url, 'title': title, 'paragraph': firstParagraph})
                i++;
            }
        }
    }

    //Cria arquivo .json a partir da lista que foi gerada.
    fs.writeFileSync('./training/database/random.json', JSON.stringify(randomContent, null, " "));
  
    // Aqui você pode interagir com a nova página
    await browser.close();

})();
