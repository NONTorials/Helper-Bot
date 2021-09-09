function Delay(delayInms) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (e) {
    console.log(e.stack);
  }
}

module.exports = {
  Delay: Delay,
};
