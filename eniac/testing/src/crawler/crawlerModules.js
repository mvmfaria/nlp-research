
/*Método 1 (Crawler): extrai URLs e textos das tags <a> em uma página, 
retornando um array de objetos com essas informações.*/
async function extractUrlsFromPage(page) {
    return await page.$$eval('a', as => as.map(a => {
      return {
        url: a.href,
        textContent: a.textContent,
      }
    }));
}

//Método 2 (Crawler): 
async function extractImgsFromPage(page) {
return await page.$$eval('img', imgs =>
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

//Método 3 (): 
function generateId(objList, id) {
    for (let obj of objList) {
    for (let img of obj.imgsLinks) {
        img.imgId = id++
    }
}
}

//Método 4 (): 
async function checkIfAllowed(url, robots) {
    await robots.useRobotsFor(url);
    return robots.canCrawl(url);
}

export { extractUrlsFromPage, extractImgsFromPage, generateId, checkIfAllowed }