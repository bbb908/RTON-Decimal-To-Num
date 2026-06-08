function log256(q) {
    if (q <= 0) return -Infinity;
    return Math.log2(q) / 8;
}

function RTONnum2int(q) {
    if (log256(q) < 1 && q > 0x7f) return 0xffffffff;

    let lastByte = q % 0x100;
    q = Math.trunc(q / 0x100);

    while (q > 0) {
        let nearLastByte = q % 0x100;
        q = Math.trunc(q / 0x100);

        if (lastByte % 2 === 0) {
            nearLastByte &= 0x7f;
        }
        nearLastByte += 0x100 * Math.floor(lastByte / 2);
        lastByte = nearLastByte;
    }

    return lastByte;
}

function int2RTONnum(q) {
    if (q <= 0x7f) return q;

    let firstByte = q % 0x100;
    q = Math.trunc(q / 0x100);
    let secondByte = q * 2;

    if (firstByte > 0x7f) {
        ++secondByte;
    } else {
        firstByte += 0x80;
    }

    let newSecondByte = int2RTONnum(secondByte);

    let l256 = log256(newSecondByte);
    let ceilL256 = isFinite(l256) ? Math.ceil(l256) : 0;
    let p = ceilL256 ? ceilL256 : 1;

    return firstByte * Math.pow(0x100, p) + newSecondByte;
}

function formatOutput(val) {
    if (val === "" || val === "Error" || val === "Invalid Number") return val;
    return val + " (0x" + (val >>> 0).toString(16).toUpperCase() + ")";
}

function calculate1() {
    let val = document.getElementById("input1").value.trim();
    let out = document.getElementById("output1");
    if(val === "") { out.innerText = ""; return; }

    let q = Number(val);
    if(isNaN(q)) { out.innerText = "Invalid Number"; return; }

    try {
        out.innerText = formatOutput(RTONnum2int(q));
    } catch(e) {
        out.innerText = "Error";
        console.error(e);
    }
}

function calculate2() {
    let val = document.getElementById("input2").value.trim();
    let out = document.getElementById("output2");
    if(val === "") { out.innerText = ""; return; }

    let q = Number(val);
    if(isNaN(q)) { out.innerText = "Invalid Number"; return; }

    try {
        out.innerText = formatOutput(int2RTONnum(q));
    } catch(e) {
        out.innerText = "Error";
        console.error(e);
    }
}