(function () {
    function generRandom ( sm, digit ) {
        var i, j,
            arr = [];
        for ( i = 1; i < sm; i ++) {
            var num = '';
            for( j = 0; j < digit; j++) {
                num += Math.floor(Math.random()*10);
            }
            arr.push(num);
        }
        return arr;
    }
    var test = generRandom( 1000000, 8);

    console.time(bubbleSort);


    bubbleSort(test);

    console.timeEnd(bubbleSort);

    function bubbleSort(  arr  ) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
                if (arr[j] > arr[j+1]) {        // 相邻元素两两对比
                    var temp = arr[j+1];        // 元素交换
                    arr[j+1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }

})();