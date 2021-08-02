
# * Review Train Word From Users

# * To avoid directory error, run this from Repo Directory

import json

quotes = []
train_quotes = []

try:
    quote_file = open("./assets/json/morequotes.json", "r")
except:
    quotes = {"วาทกรรมสลิ่ม": []}
else:
    quotes = json.load(quote_file)

mode = int(input("Approve Mode [1 for One by One or 0 for Approve All] => "))

with open("./utils/train.txt") as train_data:
    train_quotes = train_data.readlines()
    for q in train_quotes:
        q = q[:-1]
        print(q)
        if mode:
            choice = input("APPROVE? [Y for Yes, otherwise any key] => ")
            if (choice[0] == 'Y' or choice[0] == 'y'):
                quotes["วาทกรรมสลิ่ม"].append(q)
        else:
            quotes["วาทกรรมสลิ่ม"].append(q)
        print()

if len(train_quotes) <= 0:
    print("Nothing to train here! Come back later!")
    exit()

with open("./assets/json/morequotes.json", "w") as outfile:
    final_str = str(quotes)
    final_str = final_str.replace('"', '\\"')
    final_str = final_str.replace("'วาทกรรมสลิ่ม'", '"วาทกรรมสลิ่ม"')
    final_str = final_str.replace("['", '["')
    final_str = final_str.replace("']", '"]')
    final_str = final_str.replace("', '", '", "')
    outfile.write(final_str)

print("Review Completed")
print("Known Issue: \\u200b might appear in quotes, it should not affect much.")

choice = input(
    "Do you want to delete train files? [Y for Yes, otherwise any key] => ")
if(choice[0] == 'Y' or choice[0] == 'y'):
    with open("./utils/train.txt", "w") as todel:
        pass
