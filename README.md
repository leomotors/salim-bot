# Salim Discord Bot

This bot is Salim. Whenever you trigger it, It become mad.

**April Fools!!!** Wait, it passed? nvm, idc.

This discord bot is created to use for my own server. However, source code is free for anyone to implement it.

Spread headache to your friend!

## ⚠️ Please Read

**Warning**: This repo is made for closed group entertainment purpose (say `ปั่น`) only. This Repository's owner *will not be responsible* for any wrong uses. Proceed at your own risk!

## 🤝 Quality Quote & 💡 Inspiration

Thank you for **Quality** Salim Quote from [narze/awesome-salim-quotes](https://github.com/narze/awesome-salim-quotes)

**Note**: This Bot on default will pull quotes from that repository everytime it starts.

That Repository also inspire me to create this annoying 'ปั่น' Bot.

## 👨‍💻 To Implement

In case you want to (not recommend)

* Clone or Download Repo

* ```npm install```

* ```./fileinit.sh``` to create files that is necessary for program

* Then, at generated auth.json, add your token there

  **Note**: You will have to create your own bot in Discord Developer

* Compile the code with typescript, ```tsc --build```

* Run the bot with nodejs: ```node dist/src/bot.js```

**Note**: If your system doesn't use `python` for Python 3, don't forget to set its prefix in `bot_settings.json`

## 📚 Document

~~Commoner~~User Manual <a href="https://github.com/Leomotors/Salim-Bot/blob/main/docs/user_manual.md">Here</a>

Bot Settings <a href="https://github.com/Leomotors/Salim-Bot/blob/main/docs/bot_settings.md">Here</a>

Debug Manual <a href="https://github.com/Leomotors/Salim-Bot/blob/main/docs/debug.md">Here</a>

## ⚙️ Dependencies

To Implement this bot, here are dependencies.

### Required Packages

**nodejs** : ```sudo apt install nodejs```

**npm** : ```sudo apt install npm```

**Python** : ```sudo apt install python3```

**FFmpeg** : ```sudo apt install ffmpeg```

### Used npm Packages

Discord, @discordjs/opus, node-fetch, chalk, typescript

### Required Python Package

**gTTS** : ```pip3 install gTTS```

**pytube** : ```pip3 install pytube```

**pydub** : ```pip3 install pydub```

**Note**: These commands are for linux, for Windows please use appropriate installation method.

**Notice**: If the bot have hard time playing song from YouTube. That is pytube's issues and I can't do anything with it.

## 🤖 How to train น้อน

The only Method available is Manual Training a.k.a hard code (Idk what to do 😅)

```./assets/json/```

* activity.json : Status bot can use

* keywords.json : Keywords to trigger น้อน

* morequotes.json : Aggressive stuff for น้อน to say on top of already quality quotes in [narze/awesome-salim-quotes]("https://github.com/narze/awesome-salim-quotes").
   To use this feature, create this file with only one properties 'วาทกรรมสลิ่ม' set its value to array of your custom quotes.

* salim.json : น้อน can send link to person's facebook, simply append a dictionary consists of 'url' and 'name' to the array!

### Keywords adding guideline

Keywords must be all lowercase (if english alphabet exists) and no space in it.

น้อน operate the sentences by ignoring spaces and turning all english alphabet into lowercase, for example

`sinovac, sInOvAc, S I N O V A C` will all trigger the "sinovac" keywords

### Trained by People

People in Discord can also train the bot by typing `!train <Quote>`

This can also be disabled or limited to some person in bot settings

Run utils/review.py to review pending words and add to file!

## 🎶 น้อน as DJ

```./assets/music/songs.json```

### Main Dictionary

Key : Category

Value : Array of Music Dictionary

### Music Dictionary

name : Music Name & Author Name if exists

url : Youtube URL to music

## 🙏 Spread the hype!

<img src="./assets/images/long-live-hm-queen.jpg" alt="#ทรงพระเจริญ">

<img src="./assets/images/SAFETY_FIRST.jpg" alt="ปลอดภัยไว้ก่อน">

(ทรงพระเจริญ ยิ่งยืนนาน ยิ่งเมื่อย ข อ บ คุ ณ ค รั บ)
