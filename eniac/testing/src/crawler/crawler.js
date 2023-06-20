import puppeteer from 'puppeteer';
import robotsParser from 'robots-txt-parser';
import { writeFileSync } from 'fs'; // import { readFileSync, writeFileSync } from 'fs';
import { extractUrlsFromPage, extractImgsFromPage, generateId, checkIfAllowed } from './crawlerModules.js';

const DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";
const DEFAULT_HOST = "https://www.nationalgeographic.com/animals/mammals/facts/domestic-dog";
const robots = robotsParser({ userAgent: DEFAULT_USER_AGENT });

var objectsList = [];

async function crawl(home_link = DEFAULT_HOST, quant=0) {
  const browser = await puppeteer.launch({ headless : "new" });
  const page = await browser.newPage();
  await page.setUserAgent(DEFAULT_USER_AGENT);
  await page.goto(home_link);
  
  if (await checkIfAllowed(home_link, robots)) {

    console.log("Crawling site... 🕷️");

    //Extrai conteúdo da página inicial.
    const imgs = await extractImgsFromPage(page);

    const links = await extractUrlsFromPage(page);
    console.log(`\n${links.length} pages finded.`)
    
    //Adiociona o primeiro objeto da lista (não possui textContent).
    objectsList.push({url: DEFAULT_HOST, imgsLinks: imgs});
    
    //Caso não seja definido o limite, todas as páginas serão percorridas.
    if (quant == 0) { quant = links.length }
    
    let link;
    for (let i = 1; i <= links.length; i++) {
      try {
        link = links[i].url;
        if (await checkIfAllowed(link, robots)) {
          await page.goto(link, {timeout: 0}); //Precisamos do timeout?
          objectsList.push({url: link[i].url, textContent: links[i].textContent, imgsLinks: await extractImgsFromPage(page)});
        }
      } catch(error) {
        console.log(error)
        // console.log(`Não foi possível extrair da página: ${links[i]}`)
      }
      console.log(`${i}/${quant}`)
    }

    //Salvar arquivo.json no diretório.
    let fileName = 'akc'
    generateId(objectsList, 0)
    writeFileSync(`./testing/database/${fileName}.json`, JSON.stringify(objectsList, null, " "));

    await browser.close();
  }
}

//Parâmetros para o método crawl(PaginaPrincipal, quantidadeDePaginasQueSeraoExtraidas).
crawl(DEFAULT_HOST)