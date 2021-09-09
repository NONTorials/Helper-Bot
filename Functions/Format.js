function format(millis) {
  try {
    var h = Math.floor(millis / 3600000),
      m = Math.floor(millis / 60000),
      s = ((millis % 60000) / 1000).toFixed(0);
    if (h < 1)
      return (
        (m < 10 ? "0" : "") +
        m +
        ":" +
        (s < 10 ? "0" : "") +
        s +
        " | " +
        Math.floor(millis / 1000) +
        " segundos"
      );
    else
      return (
        (h < 10 ? "0" : "") +
        h +
        ":" +
        (m < 10 ? "0" : "") +
        m +
        ":" +
        (s < 10 ? "0" : "") +
        s +
        " | " +
        Math.floor(millis / 1000) +
        " segundos"
      );
  } catch (error) {
    console.log(e.message);
  }
}

module.exports = {
  format: format,
};
