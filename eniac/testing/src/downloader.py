import json
import requests
import shutil


# Opening JSON file
f = open('./eniac/testing/database/wikipedia.json', encoding="utf8")
data = json.load(f)
for obj in data:
    #Captura a lista de links.
    imgsLinks = obj['imgsLinks']

    #Tenta fazer o download.
    for img in imgsLinks:
        res = requests.get(img['imgUrl'], stream = True)
        
        if res.status_code == 200:
            with open(f"./eniac/testing/database/imgs/{img['imgId']}.jpg",'wb') as f:
                shutil.copyfileobj(res.raw, f)
            print('Image sucessfully Downloaded')
        else:
            print('Image Couldn\'t be retrieved! - ', 'Error: ', res.status_code)

f.close()