
# * Download Music from YouTube

from pytube import YouTube

url = input()
yto = YouTube(url)
targetdl = yto.streams.filter(only_audio=True).first()
title = targetdl.title

# * Return title to js
print(title, end='')

# * Download and save at temp folder
targetdl.download(output_path = "./temp/", filename = "tempmusic")
