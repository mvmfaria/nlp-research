import os
import csv
import json

#----------------------------------------------------- utils
def retornaListaDeConteudoNoDiretorio(path):
    contents = os.listdir(path)
    return contents

def removeExtensao(lista):
    for i in range(len(lista)):
        nome, extensao = os.path.splitext(lista[i])
        lista[i] = nome
    return lista
#-----------------------------------------------------

# imgs = removeExtensao(retornaListaDeConteudoNoDiretorio("./crawler/data/data-img/akc"))
# detection_result = removeExtensao(retornaListaDeConteudoNoDiretorio("./crawler/detection/akc/labels"))
f = open('./eniac/training/database/dog.json', encoding="utf8")
data = json.load(f)

with open(f'./eniac/pre-processing/dog-dataset.csv', 'w', newline="", encoding="utf8") as file:
    writer = csv.writer(file)
    field = ["url", "title", "paragraph"]
    writer.writerow(field)

    for obj in data:
        url = obj['url'].replace("\n", "")
        title = obj['title'].replace("\n", "")
        paragraph = obj['paragraph'].replace("\n", "")
        writer.writerow([url, title, paragraph])