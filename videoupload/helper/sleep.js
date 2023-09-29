async function sleep(sec) {
  const sleepMsec = Number(sec) * 1000;
  return new Promise((resolve) => setTimeout(() => resolve(true), sleepMsec));
}

module.exports = sleep;
