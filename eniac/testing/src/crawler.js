import puppeteer from 'puppeteer';
import robotsParser from 'robots-txt-parser';
import { writeFileSync } from 'fs'; // import { readFileSync, writeFileSync } from 'fs';

const DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";
const DEFAULT_HOST = "https://en.wikipedia.org/wiki/List_of_dog_breeds";
const robots = robotsParser({ userAgent: DEFAULT_USER_AGENT });

var objectsList = [];

async function checkIfAllowed(url) {
  await robots.useRobotsFor(url);
  return robots.canCrawl(url);
}

async function crawl(home_link = DEFAULT_HOST, quant=0) {
  const browser = await puppeteer.launch({ headless : "new" });
  const page = await browser.newPage();
  await page.setUserAgent(DEFAULT_USER_AGENT);
  await page.goto(home_link);

  if (await checkIfAllowed(home_link)) {
    console.log("Crawling site... 🕷️");
    const imgs = await fetchImgs(page);
    const links = await fetchUrls(page);
    console.log(`\n${links.length} pages finded.`)

    objectsList.push({url: DEFAULT_HOST, imgsLinks: imgs});

    //Caso não seja definido o limite, todas as páginas serão percorridas.
    if (quant == 0) { quant = links.length }

    let link;
    for (let i = 0; i <= quant; i++) {
      link = links[i].url;
      try {
        if (await checkIfAllowed(link)) {
            await page.goto(link, {timeout: 0}); //precisamos do timeout?
            objectsList.push({url: link, textContent: links[i].textContent, imgsLinks: await fetchImgs(page)});
        }
      } catch(error) {
        // console.log(`Não foi possível acessar o link:', ${link}`)
        console.log(error)
      }

      console.log(`${i}/${quant}`)
    }

    await browser.close();
    
    //Salvar arquivo.json no diretório.
    let fileName = 'wikipedia'
    generateId(objectsList, 0)
    writeFileSync(`./eniac/testing/database/${fileName}.json`, JSON.stringify(objectsList, null, " "));
  }
}

async function fetchUrls(page) {
  return await page.$$eval('a', as => as.map(a => {
    return {
      url: a.href,
      textContent: a.textContent,
      }
    }));
}

async function fetchImgs(link) {
  return await link.$$eval('img', imgs =>
    imgs.filter(img =>
      img.naturalWidth > 100 &&
      img.naturalHeight > 100 &&
      img.src.endsWith('.gif') == false &&
      img.alt != "" &&
      img.src != ""
    ).map(img => {
      return {
        imgUrl: img.src,
        imgAlt: img.alt,
        imgId: null
      }
    }));
}

function generateId(objList, id) {
  for (let obj of objList) {
    for (let img of obj.imgsLinks) {
      img.imgId = id++
    }
  }
}


//Parâmetros para o método crawl(PaginaPrincipal, quantidadeDePaginasQueSeraoExtraidas).
crawl(DEFAULT_HOST, 50)