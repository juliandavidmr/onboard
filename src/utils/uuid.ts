export function generateUUID() {
  const d = new Date();
  const k = d.getTime();
  const str = k.toString(16).slice(1);
  const UUID = 'xxxx-xxxx-4xxx-yxxx-xzx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 3 | 8);
    return v.toString(16);
  });
  const newString = UUID.replace(/[z]/, str);
  return newString;
}
