(function () {
    var utils = window.AppointmentUtils;

    if (!utils) {
        throw new Error("AppointmentUtils not found. Please load payload-utils.js first.");
    }

    var form = document.getElementById("appointmentForm");
    var submitBtn = document.getElementById("submitBtn");
    var statusLog = document.getElementById("statusLog");
    var logList = document.getElementById("logList");

    var inputName = document.getElementById("v_name");
    var inputPlate = document.getElementById("v_plateNumber");
    var inputStart = document.getElementById("v_timeStr");
    var inputEnd = document.getElementById("v_lvTimeStr");

    var dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    function setStatus(message, type) {
        statusLog.textContent = message;
        statusLog.className = "status" + (type ? " " + type : "");
    }

    function formatLogDate(date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, "0");
        var day = String(date.getDate()).padStart(2, "0");
        var hour = String(date.getHours()).padStart(2, "0");
        var minute = String(date.getMinutes()).padStart(2, "0");
        var second = String(date.getSeconds()).padStart(2, "0");
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }

    function addSubmitLog(submitDate, isSuccess) {
        var item = document.createElement("li");
        var statusText = isSuccess ? "成功" : "失败";
        item.textContent = "提交日期: " + formatLogDate(submitDate) + " | 成功状态: " + statusText;
        logList.prepend(item);
    }

    function initForm() {
        var now = new Date();
        var payload = utils.buildPayload(now);

        inputName.value = payload.v_name;
        inputPlate.value = payload.v_plateNumber;
        inputStart.value = payload.v_timeStr;
        inputEnd.value = payload.v_lvTimeStr;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var submitDate = new Date();

        if (!dateTimePattern.test(inputStart.value) || !dateTimePattern.test(inputEnd.value)) {
            setStatus("提交失败：时间格式必须是 YYYY-MM-DD HH:mm:ss", "error");
            addSubmitLog(submitDate, false);
            return;
        }

        var payload = utils.buildPayload(new Date(), {
            v_timeStr: inputStart.value,
            v_lvTimeStr: inputEnd.value
        });
        var endpoint = utils.getEndpoint(new Date());

        submitBtn.disabled = true;
        setStatus("提交中...", "");

        fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(function (response) {
                return response.text().then(function (text) {
                    var body;

                    try {
                        body = text ? JSON.parse(text) : {};
                    } catch (e) {
                        body = { rawText: text };
                    }

                    if (!response.ok) {
                        var error = new Error("HTTP " + response.status);
                        error.responseBody = body;
                        throw error;
                    }

                    setStatus("提交成功", "success");
                    addSubmitLog(submitDate, true);
                });
            })
            .catch(function (error) {
                setStatus("提交失败：" + error.message, "error");
                addSubmitLog(submitDate, false);
            })
            .finally(function () {
                submitBtn.disabled = false;
            });
    });

    initForm();
})();
