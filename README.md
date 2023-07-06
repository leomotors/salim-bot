# Salim Discord Bot V4

**Fun Fact**: This is my _most active_ project on GitHub

Salim Bot that is currently running of my friends server and is most active bot because it is auto triggered by พวกชังชาติ

## ✨ คุณสมบัติของบอทสลิ่ม

- ปราบปรามพวกชังชาติโดยอัตโนมัติด้วยระบบตอบกลับ~~อัจฉริยะ~~

<img src="./images/salim-bot-0.png" height=150px />
<img src="./images/salim-bot-2.png" height=150px />

_ขอขอบคุณ[คลังข้อมูล](https://github.com/narze/awesome-salim-quotes)สำหรับคำพูดที่ใช้ในการต่อกรกับพวกชังชาติโดยคุณ narze_

_และนอกจากจะเป็นฐานข้อมูลแล้ว repository ดังกล่าวก็เป็นแรงบันดาลใจให้ผู้สร้าง สร้างบอทตัวนี้ เพื่อร่วมลุกขึ้นต่อกรกับพวกสามกีบชังชาติ_

- สามารถแนะนำสื่อที่มีคุณภาพ เป็นกลาง ให้กับผู้คนในเซิร์ฟเวอร์ได้ 💯

<img src="./images/fb.png" width=600px />

- เปิดเพลงเพื่อเสริมความรักชาติ ศาสน์ กษัตริย์ แก่ทุกคนที่อยู่ในเซิร์ฟเวอร์

<img src="./images/djsalima.png" width=600px />

- [Slash Command✨] แบบทดสอบเพื่อทดสอบความรักชาติ และเพิ่มความตระหนักรู้

<img src="./images/quiz.png" width=600px />

- และฟีเจอร์อีกหลากหลายในเวอร์ชั่นก่อนๆ แต่ถูกตัดทิ้งเพราะคนทำ~~ชังชาติ~~ (จริงๆคือ refactor แล้วขี้เกียจเขียนใหม่)

- [NEW! ✨] Social Credit (Preview) Feature! Note: Prisma Engine and PostgreSQL required

## ⚙️ Under the Hood

**WARNING: LEGACY CODE**

The Salim Bot _since April 2021_ has long history, of course it has big technical debt.

Each major version (except 3->4) is a rewrite

Currently, since version 3 Salim Bot is implemented by Salim Bot Framework, Available as _s-bot-framework_ on [npm](https://www.npmjs.com/package/s-bot-framework)

Version 4 includes Cocoa Discord Utils which take care of all Slash Commands
working with _legacy code_ underneath, Just like what Windows 11 is.

## [ใหม่!] ✨✨ Docker Image

คุณเองก็สามารถรันบอทสลิ่มได้ง่าย ๆ เพียงแค่รันคำสั่งนี้

`docker pull ghcr.io/leomotors/salim-bot:latest`

ตัวแปรสิ่งแวดล้อมที่จำเป็นต้องใช้ได้แก่ DISCORD_TOKEN และ DATABASE_URL

อย่าลืมเมล็ดฐานข้อมูลก่อนใช้งาน

## 🛣️ Previous Version: Legacy Salim Bot

_warning_: Legacy Code

- 2.2.431 [Last of V2](https://github.com/Leomotors/Salim-Bot/tree/52ec1163deec606aaeed0a6cd6968815edd3f94c) (Before implementing newly written [s-bot-framework](https://github.com/Leomotors/s-bot-framework))
- 1.15.248 [Last of V1](https://github.com/Leomotors/Salim-Bot/releases/tag/1.15.248) (Before rewritten in Version 2)
- 1.13.213 [Before TS ~~(ThakSin)~~](https://github.com/Leomotors/Salim-Bot/releases/tag/1.13.213) (JavaScript Version)

_which each major version have some feature dropped, lmao_

### Not sponsored by

`s-bot-framework` is specific for Salim Bot, but if you would want to create
normal Discord Bot, this is a good library =>
[Cocoa Discord Utils](https://github.com/Leomotors/cocoa-discord-utils)

## 👨‍💻 To Implement

In case you want to (not recommended)

- Clone or Download Repo

  `git clone https://github.com/Leomotors/Salim-Bot`

- Add required .env parameters

- For the first time, do `pnpm install` to install dependencies
  and `pnpm build` to build the bot.

- To start bot, do `pnpm start`

- To Stop Bot and Logout _properly_, Type `logout` in the Bot Console

### ⚠️ Caution

**Proceed at your own risk** Good Luck!

### 🌿 Prerequisites

- Latest nodejs 16+ (discord.js requirements)

- PostgreSQL 12 เราเลือกใช้ Postgres เพราะมีโลโก้เป็นรูปช้าง และช้างเป็นสัตว์ประจำชาติไทย

## 📚 Documents

As This Bot is powered by [s-bot-framework](https://github.com/Leomotors/s-bot-framework)

_again, warning_: Legacy Code

Documentation of this bot and full feature list of this bot is mostly explained in that framework's documentation, (if you can understand it)

## 🙏 Spread the hype!

<img src="./images/long-live-hm-queen.jpg" alt="#ทรงพระเจริญ" width=400px>

<img src="./images/SAFETY_FIRST.jpg" alt="ปลอดภัยไว้ก่อน" width=400px>
