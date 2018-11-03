class Random {
    /**
    * Get a random int
    *
    */
    static int(min = 1, max = 9999999) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
    * Generate random string
    *
    * @param int length
    * @return string
    */
    static string(length = 32) {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz0123456789";

        for(let i = 0; i < length; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    /**
    * Generate random id
    *
    * @return string
    */
   static id(length = 32) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

        for(var i = 0; i < length; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return 'el-' + text;
    }
}


if (typeof window == 'undefined') {
    global.Random = Random;
}