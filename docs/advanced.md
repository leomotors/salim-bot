# Advanced Usage

## Local Quotes " morequotes.json

To add more quotes on top of ASQ, create a file "morequotes.json" in data folder

```
{
  "วาทกรรมสลิ่ม": [ Array of Your Custom Local Quotes Here ]
}
```

You can also add more keywords, songs or Facebooks to JSON files in data folder!

## Keywords adding : keywords.json

Keywords must be all lowercase (if english alphabet exists) and no space in it.

The reason is the bot process sentences by ignoring spaces and turning all english alphabet into lowercase, for example

`Sinovac, sInOvAc, S I N O V A C` will all equivalent to "sinovac"

## Others in data

Please look at the schema and add your own in same theme as it

## config/bot_settings.json

- Copy bot_settings.template.json to bot_settings.json

- Edit properties you would like to

- See src/template/BotSettings.template.ts for more info

## Salim Shell

- Do #!salim disable to disable all bot's activity on that channel ~~including sending data to Thai Government~~

- Do #!salim enable again to remove that

- Do #!salim sudo to execute Console Command without Console

## Console

- Please look at source code (src/console/Console.ts) for more details
