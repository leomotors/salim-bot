# Debug Manual

Debug is accessible via console

**Warning**: There is no error check here, bot may crashs upon inproper uses

## Note: Dictionary

Latest channel : Latest channel that it recieved message

## Command List

### quote

Args : Quote ID

Send Quote with that ID to latest channel

```
> quote 1
Sent to latest channel :อ้างแต่ประชาธิปไตย แต่ไม่ทำตามกฎหมาย และไม่เคารพศักดิ์ศรีและความเป็นมนุษย์ของผู้อื่น
```

### say

Args: Message (string)

Send that message to latest channel

```
> say yahallo!
Sent to latest channel: yahallo!
```

### speak

Args: Message (string)

Speak that message to current voice channel

```
> say สวัสดีคร้าบ
Spoke to current voice channel: สวัสดีคร้าบ
```

### speakquote

Args: Quote ID

Speak Quote with that ID to current voice channel

```
> speakquote 3
Spoke to current voice channel: เด็กสมัยนี้รู้จักแต่สิทธิไม่รู้จักหน้าที่
```

### song

Args: Song ID

Play Song with that ID to current voice Channel

```
> song 1
Playing to current voice channel: 渡辺しのすげ 「สรรเสริญพระบารมี アイドルリミックス」
```

### youtube

Args: YouTube URL (full URL)

Play Song from YouTube on current channel

```
> youtube https://www.youtube.com/watch?v=EHzwIOi9lm8
Playing to current voice channel: Petit Rabbit's 「ノーポイッ!」
```

### query

Args: Thing want to query

#### songs

Print full list of songs available

#### quotes

Args: Start Index ; Query Count

Print list of quote starting at Start Index with given Numbers of Count

```
> query quotes 30 10
Will print quote #30-39
```

### dc

Leave current voice chat
