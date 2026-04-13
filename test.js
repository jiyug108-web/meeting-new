const assert = require("assert");
const utils = require("./payload-utils");

function runTests() {
    const fixedDate = new Date("2026-03-18T12:34:56");

    assert.strictEqual(utils.getTodayStartTime(fixedDate), "2026-03-18 08:00:00");
    assert.strictEqual(utils.getTodayEndTime(fixedDate), "2026-03-18 23:56:00");

    const payload = utils.buildPayload(fixedDate);
    assert.strictEqual(payload.v_name, "吉煜");
    assert.strictEqual(payload.v_plateNumber, "晋M39068");
    assert.strictEqual(payload.v_timeStr, "2026-03-18 08:00:00");
    assert.strictEqual(payload.v_lvTimeStr, "2026-03-18 23:56:00");
    assert.strictEqual(payload.v_phone, "15910303914");
    assert.strictEqual(payload.v_dw, "ibm");

    const customPayload = utils.buildPayload(fixedDate, {
        v_timeStr: "2026-03-20 10:10:10",
        v_lvTimeStr: "2026-03-20 22:22:22"
    });
    assert.strictEqual(customPayload.v_timeStr, "2026-03-20 10:10:10");
    assert.strictEqual(customPayload.v_lvTimeStr, "2026-03-20 22:22:22");

    const endpoint = utils.getEndpoint(new Date(1700000000000));
    assert.strictEqual(
        endpoint,
        "https://fangk.yili.com:10443/evo-apigw/evo-visitor/1.0.0/card/visitor/appointment?systime=1700000000000"
    );

    console.log("All tests passed.");
}

runTests();

