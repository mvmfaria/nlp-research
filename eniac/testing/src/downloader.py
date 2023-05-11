import json
import requests
import shutil

# Opening JSON file
f = open('./testing/database/wikipedia.json', encoding="utf8")
data = json.load(f)
id = 0

for obj in data:
    #Captura a lista de links.
    imgsLinks = obj['imgsLinks']

    #Atribui id para o objeto (altera o arquivo?).
    obj['id'] = id

    #Tenta fazer o download.
    for img in imgsLinks:
        res = requests.get(img['imgUrl'], stream = True)
        
        if res.status_code == 200:
            with open(f"./testing/database/{id}.jpg",'wb') as f:
                shutil.copyfileobj(res.raw, f)
            print('Image sucessfully Downloaded')
        else:
            print('Image Couldn\'t be retrieved! - ', 'Error: ', res.status_code)

        id+=1

f.close()