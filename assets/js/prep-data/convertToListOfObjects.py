import csv
import json

myFile = open('./FawzyMenu.csv', 'r')
reader = csv.DictReader(myFile)
myList = list()
for dictionary in reader:
    myList.append(dictionary)
print("The list of dictionaries is:")
print(myList)

with open("menuItems.json", "w") as final:
    json.dump(myList, final, indent=2)
