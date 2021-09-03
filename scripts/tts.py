from gtts import gTTS
text = input()
tts = gTTS(text, lang="th", slow=False)
tts.save("./temp/tts.mp3")
