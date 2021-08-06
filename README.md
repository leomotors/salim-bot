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

  **Note**: There maybe compilation error on some devices like raspberry pi,
   my solution is to compile it in linux and transfer compiled one to run

* Run the bot with nodejs: ```npm start```

**Note**: If your system doesn't use `python3` for Python 3, don't forget to set its prefix in `bot_settings.json`

## 📚 Document

~~Commoner~~User Manual <a href="https://github.com/Leomotors/Salim-Bot/blob/main/docs/user_manual.md">Here</a>

Bot Settings <a href="https://github.com/Leomotors/Salim-Bot/blob/main/docs/bot_settings.md">Here</a>

Debug Manual <a href="https://github.com/Leomotors/Salim-Bot/blob/main/docs/debug.md">Here</a>

## 📈 Compatibility Test Result

**Ubuntu 20.04.2 on Windows 10 Linux Subsystem / Kernel: 5.10.43.3**: Able to Compile Typescript and Run

**Raspbian 10 on Raspberry Pi 3 Model A+ Rev 1.0 / Kernel: 5.10.17-v7+** : Unable to Compile Typescript but can Run normally (by using compiled code from above)

## ⚙️ Dependencies

To Implement this bot, here are dependencies.

### Required Packages

**nodejs** : ```sudo apt install nodejs```

**npm** : ```sudo apt install npm```

**Python** : ```sudo apt install python3```

**FFmpeg** : ```sudo apt install ffmpeg```

### Used npm Packages

Discord, @discordjs/opus, node-fetch, chalk, typescript

```
npm install
```

### Required Python Package

gTTS, pytube, pydub

```
pip3 install -r requirements.txt
```

**Notice**: If the bot fails on playing music, pytube may be broken and we'll need to wait for their bug fixes.

## 🤖 How to train น้อน

The only Method available is Manual Training a.k.a hard code (Idk what to do 😅)

```./assets/json/```

* activity.json : Status bot can use

* keywords.json : Keywords to trigger น้อน

* morequotes.json : Aggressive stuff for น้อน to say on top of already quality quotes in [narze/awesome-salim-quotes]("https://github.com/narze/awesome-salim-quotes")

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

<img src="./assets/images/SAFETY_FIRST.jpg" alt="ปลอดภัยไว้ก่อน" height=250px>

(ทรงพระเจริญ ยิ่งยืนนาน ยิ่งเมื่อย ข อ บ คุ ณ ค รั บ)
