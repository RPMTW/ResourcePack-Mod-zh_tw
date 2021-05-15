import json
import requests

while True:
    # filename = input('檔案名稱(包含附檔名)(輸入"0"以關閉程式):')
    # if filename == '0':
    # break
    # with open(filename, 'r', encoding='utf8') as file:
    # data = json.load(file)
    # with open(filename, 'w', encoding='utf8') as file:
    #   json.dump(data, file, sort_keys=True, indent=4, ensure_ascii=False)
    # print('轉換完成')
    # By 

    url = str(
        'https://addons-ecs.forgesvc.net/api/v2/addon/search?categoryId=0&gameId=432&index=0&pageSize=${modCount}&gameVersion=${ver}&sectionId=6&sort=1').format()

    resp = requests.get(url=url)
    data = resp.json()
