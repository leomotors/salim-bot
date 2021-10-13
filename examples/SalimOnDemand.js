// * Example of Salim on Demand (SOD)

/* eslint-disable */
client.useVoice({
    jutsu: "SOnDemand",
    prefix: {
        join: ["!salim"],
        leave: ["!leave", "!dc"],
    },
    onJoin: "บอทสลิ่มมาแล้วนะจ๊ะ",
    fallback: {
        join_fail: {
            reply: true,
            message: {
                no_channel: "จะให้ฉันเข้าไปคุยกับผีหรอ",
                stage_channel: "ฉันไม่เข้าคลับเฮาส์ นั่นมันที่ของคนชังชาติ",
                internal: "เกิดปัญหาขึ้น น่าจะเป็นฝีมือของทักษิณ",
            },
        },
        already_join: {
            message:
                "ฉันอยู่นี่แล้วไง ยังจะเอาอะไรอีก พวกสามกีบหัดรู้จักพอบ้าง",
            reply: true,
        },
        onsite_leave: {
            message:
                "ฉันไม่ออก (คุณต้องอยู่ในช่องเดียวกับฉันถึงจะไล่ฉันออกได้)",
            reply: true,
        },
    },
    rules: {
        onsite_leave: true,
    },
});
