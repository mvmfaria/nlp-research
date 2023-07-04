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
d = open('./training/database/dog.json', encoding="utf8")
r = open('./training/database/random.json', encoding="utf8")
dog = json.load(d)
random = json.load(r)

with open(f'./pre-processing/training-dataset.csv', 'w', newline="", encoding="utf8") as file:
    writer = csv.writer(file)
    field = ["text", "isdog"]
    writer.writerow(field)

    for obj in dog:
        text = obj['paragraph'].replace("\n", "")
        isdog = 1
        writer.writerow([text, isdog])
    
    for obj in random:
        text = obj['paragraph'].replace("\n", "")
        isdog = 0
        writer.writerow([text, isdog])