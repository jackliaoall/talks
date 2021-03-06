/*********************************************************/
/* Execute sequentially scheduled at each loop iteration */
/*                                                       */
/*  $ node 04_heavy_cut_async2.js                        */
/*********************************************************/
function doNotSoHeavy (times) {
    var count = 0;

    for (var i = 0; i < times; i++) {
        if (Math.round(Math.log(
            Math.sqrt(Math.abs(Math.round(Math.random() * 1000)))
        )) === 1)
            count++;
    }
    return count;
}

function doHeavy(callback) {
    var total = 1e8,
        cuts = 100,
        counts = 0,
        remains = cuts;

    function doPerLoopIter() {
        setImmediate(function () {
            counts = counts + doNotSoHeavy(total/cuts);
            remains--;
            if (!remains) {
                process.nextTick(function () {
                    callback(counts);
                });
            } else {
                doPerLoopIter();
            }
        });
    }
    doPerLoopIter();
}

setInterval(function () {
    console.log('I am not blocked');
}, 1000);

doHeavy(function (counts) {
    console.log(counts);
});

