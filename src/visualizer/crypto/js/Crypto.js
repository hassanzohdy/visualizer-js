class Crypto {
    /**
     * Encrypt the given value
     * 
     * @param mixed value
     * @returns string
     */
    encrypt(value) {
        if (Is.object(value)) {
            value = JSON.stringify(value);
        }

        return CryptoJS.AES.encrypt(value, Config.get('app.name')).toString();
    }

    /**
     * Decrypt the given cipher text
     * 
     * @param string cipherText
     * @returns string
     */
    decrypt(cipherText) {
        let decrypted = CryptoJS.AES.decrypt(cipherText, Config.get('app.name'));

        let value = decrypted.toString(CryptoJS.enc.Utf8);

        if (Is.json(value)) {
            value = JSON.parse(value);
        }

        return value;
    }
}

DI.register({
    class: Crypto,
    alias: 'crypto',
});