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

detect = removeExtensao(retornaListaDeConteudoNoDiretorio("./testing/src/yolov7/runs/detect/exp/labels"))
imgs = open('./testing/database/new_wikipedia.json', encoding="utf8")
list_of_objects = json.load(imgs)

print(detect)

# for obj in list_of_objects:
#     print(obj)
#         # for obj_img in obj['imgsLinks']:
#         #     print(obj_img['imgId'])

with open(f'./pre-processing/manual_labeled.csv', 'w', newline="", encoding="utf8") as file:

    writer = csv.writer(file)
    field = ["text", "isdog"]
    writer.writerow(field)

    # for obj in list_of_objects:
    #     for obj_img in obj['imgsLinks']:
    #         if (str(obj_img['imgId']) in detect):
    #             isdog = 1
    #         else:
    #             isdog = 0
    #         writer.writerow([obj_img['imgAlt'], isdog])

    for obj in list_of_objects:
        for obj_img in obj['imgsLinks']:
            writer.writerow([obj_img['imgAlt'], obj_img['isdog']])
    
    # for obj in random:
    #     text = obj['paragraph'].replace("\n", "")
    #     isdog = 0
    #     writer.writerow([text, isdog])