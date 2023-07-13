import { createAudioResource, AudioResource } from "@discordjs/voice";

import { getAllAudioUrls } from "google-tts-api";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { IncomingMessage } from "node:http";
import https from "node:https";
import { Readable } from "node:stream";

import { sLogger } from "../logger/index.js";

export async function createGoogleResources(content: string) {
  const results = getAllAudioUrls(content, {
    lang: "th",
    slow: false,
  });

  return await Promise.all(
    results.map(async (url) =>
      createAudioResource(
        await new Promise<IncomingMessage>((res, _) => {
          https.get(url.url, (stream) => {
            res(stream);
          });
        }),
      ),
    ),
  );
}

function createAZConfig() {
  if (!process.env.SPEECH_KEY || !process.env.SPEECH_REGION) {
    return null;
  }

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.SPEECH_KEY,
    process.env.SPEECH_REGION,
  );

  speechConfig.speechSynthesisVoiceName = "th-TH-NiwatNeural";

  return speechConfig;
}

const speechConfig = createAZConfig();

export const azureTTSEnabled = speechConfig !== null;

if (azureTTSEnabled) {
  sLogger.log("[TTS] Azure Credentials found, using Niwat");
} else {
  sLogger.log("[TTS] Azure Credentials not found, using Google TTS");
}

export async function createNiwatResources(content: string) {
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig!);

  return new Promise<AudioResource[]>((resolve) =>
    synthesizer.speakTextAsync(content, (res) => {
      resolve([createAudioResource(Readable.from(Buffer.from(res.audioData)))]);
    }),
  );
}

export function createTTSResource(content: string) {
  if (azureTTSEnabled) {
    return createNiwatResources(content);
  } else {
    return createGoogleResources(content);
  }
}
