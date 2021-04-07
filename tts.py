
# * Get input and store it in ./temp/temp_tts.mp3

from gtts import gTTS

inputstr = input()

tts = gTTS(text = inputstr, lang = "th")
tts.save("./temp/temp_tts.mp3")