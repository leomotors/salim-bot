
# * Get input and store it in ./temp/temp_tts.mp3

from gtts import gTTS

inputstr = input()

tts = gTTS(text = inputstr, lang = "th")
tts.save("./temp/temp_original_tts.mp3")

# * Make Speech Louder
from pydub import AudioSegment

speech = AudioSegment.from_mp3("./temp/temp_original_tts.mp3")
louder_speech = speech + 9

louder_speech.export("./temp/temp_tts.mp3", format='mp3')