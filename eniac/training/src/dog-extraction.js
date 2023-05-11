const {launch} = require('puppeteer');
const fs = require('fs');

(async () => {

    const browser = await launch( { headless : false } );
    const page = await browser.newPage();

    //Lista com os objetos (url, title, paragraph).
    dogContent = [];

    //Navega ate uma pagina "Dogs breeds".
    await page.goto('https://en.wikipedia.org/wiki/List_of_dog_breeds');
    
    //Extrai todos os links da lista com as racas.
    const links = await listLinks(page);

    for (let link of links) {

        await page.goto(link);

        const title = await page.title();
        const firstParagraph = await page.$eval('p', el => el.textContent);

        //Adiciona um objeto (url, title, paragraph) na lista.
        dogContent.push({'url': link, 'title': title, 'paragraph': firstParagraph})
    }

    //Cria arquivo .json a partir da lista que foi gerada.
    fs.writeFileSync('./database/dog.json', JSON.stringify(dogContent, null, " "));
  
    //Aqui você pode interagir com a nova página
    await browser.close();

})();

//----------------------------------------------------------------------------- reutilizado do Scraper.
async function listLinks(page) {
    return page.evaluate(() => {
        return Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.href)
    })
}
//-----------------------------------------------------------------------------------------------------