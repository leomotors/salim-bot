# Salim Discord Bot V๔

Salim Bot is ~~currently running on my friends server~~ โดนเตะออกไปแล้ว น่ารำคาญเกิน
and is most active bot because it is auto triggered by พวกชังชาติ (เซิร์ฟของ @tinarskii)

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

- [NEW! ✨] Social Credit (Preview and Forever Preview) Feature! Note: Prisma Engine and PostgreSQL required

### 🌿 ก่อนใช้งาน

- Node.js ๒๐ (เลิกใช้ ๑๖ ได้แล้ว มัน EOL แล้ว)

- PostgreSQL เราเลือกใช้ Postgres เพราะมีโลโก้เป็นรูปช้าง และช้างเป็นสัตว์ประจำชาติไทย

## 👨‍💻 วิธีใช้งาน

In case you want to (not recommended)

- Clone or Download Repo

  `git clone https://github.com/leomotors/salim-bot`

- Add required .env parameters

- For the first time, do `pnpm install` to install dependencies, `pnpm prisma generate`
  and `pnpm build` to build the bot.

- To start bot, do `pnpm start`

- To Stop Bot and Logout _properly_, Type `logout` in the Bot Console

## [ใหม่!] ✨✨ Docker Image

คุณเองก็สามารถรันบอทสลิ่มได้ง่าย ๆ เพียงแค่รันคำสั่งนี้

`docker pull ghcr.io/leomotors/salim-bot:latest`

ตัวแปรสิ่งแวดล้อมที่จำเป็นต้องใช้ได้แก่ `DISCORD_TOKEN` และ `DATABASE_URL`
อย่าลืมใส่ `SPEECH_KEY` และ `SPEECH_REGION` หากคุณต้องการใช้เสียงของนิวัฒน์

อย่าลืมเมล็ดฐานข้อมูลก่อนใช้งาน

## ⚙️ Under the Hood

The Salim Bot _since April 2021_ has long history so it is filled with
legacy code + technical debt แบบเบิ้ม ๆ คือลือ.

I won't fix old code unless it is needed for new feature.

## 🛣️ Previous Version: Legacy Salim Bot

_warning_: Legacy Code

- 2.2.431 [Last of V2](https://github.com/Leomotors/Salim-Bot/tree/52ec1163deec606aaeed0a6cd6968815edd3f94c) (Before using [s-bot-framework](https://github.com/Leomotors/s-bot-framework) which were very awful)
- 1.15.248 [Last of V1](https://github.com/Leomotors/Salim-Bot/releases/tag/1.15.248) (Before rewritten in Version 2)
- 1.13.213 [Before TS where TS = ~~(ThakSin)~~ TypeScript](https://github.com/Leomotors/Salim-Bot/releases/tag/1.13.213) (JavaScript Version)

_each major version have some feature dropped because I'm lazy to migrate_

### ⚠️ Caution

**Proceed at your own risk** Good Luck!

## 📚 Documents

ไม่ต้องมี เอาไปทำไรวะ

## 🙏 Spread the hype!

<img src="./images/long-live-hm-queen.jpg" alt="#ทรงพระเจริญ" width=400px>

<img src="./images/SAFETY_FIRST.jpg" alt="ปลอดภัยไว้ก่อน" width=400px>

ค
