export function generateUUID() {
    var d = new Date();
    var k = d.getTime();
    var str = k.toString(16).slice(1)
    var UUID = 'xxxx-xxxx-4xxx-yxxx-xzx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        let v = c == 'x' ? r : (r & 3 | 8);
        return v.toString(16);
    });
    var newString = UUID.replace(/[z]/, str)
    return newString;
}