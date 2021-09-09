function toUpperCase(x) {
  if (typeof x !== "string") return;
  let y = x.split(" ");
  let z = y[0].charAt(0).toUpperCase() + y[0].slice(1).toLowerCase();
  if (y[1]) {
    let a = y[1].charAt(0).toUpperCase() + y[1].slice(1).toLowerCase();
    return [z, a];
  } else {
    return [z];
  }
}
module.exports = {
  toUpperCase: toUpperCase,
};
