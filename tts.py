
# * Get input and store it in ./temp/bot_temp.mp3

from gtts import gTTS

inputstr = input()

tts = gTTS(text = inputstr, lang = "th")
tts.save("./temp/bot_temp.mp3")