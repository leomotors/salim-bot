
# * Review Train Word From Users

# * To avoid directory error, run this from Repo Directory

import json

quotes = []

with open("./assets/json/morequotes.json", "r") as quote_file:
    quotes = json.load(quote_file)

    with open("./utils/train.txt") as train_data:
        train_quotes = train_data.readlines()
        for q in train_quotes:
            q = q[:-1]
            print(q)
            choice = input("APPROVE? [Y for Yes, otherwise any key] => ")
            if (choice[0] == 'Y'):
                quotes["วาทกรรมสลิ่ม"].append(q)
            print()

with open("./assets/json/morequotes.json", "w") as outfile:
    final_str = str(quotes)
    final_str = final_str.replace('"', '\\"')
    final_str = final_str.replace("'วาทกรรมสลิ่ม'", '"วาทกรรมสลิ่ม"')
    final_str = final_str.replace("['", '["')
    final_str = final_str.replace("']", '"]')
    final_str = final_str.replace("', '", '", "')
    outfile.write(final_str)

print("Review Completed, Please use auto format in VSCode to format the json")

choice = input(
    "Do you want to delete train files? [Y for Yes, otherwise any key] => ")
if(choice[0] == 'Y'):
    with open("./utils/train.txt", "w") as todel:
        pass
