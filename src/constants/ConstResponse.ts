// * ConstResponse.ts : Constant Response of the Bot

interface BotResponse {
    keywords: string[]
    response: string,
}

export const constResponse: BotResponse[] = [
    {
        "keywords": ["introduce", "แนะนำตัว"],
        "response": "ส วั ส ดี ค รั บ ท่ า น ส ม า ชิ ก ช ม ร ม ค น รั ก ก ะ สั ส ทุ ก ท่ า น"
    }
];
