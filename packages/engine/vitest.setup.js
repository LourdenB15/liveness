// Suppress the TensorFlow.js Node.js backend nag message during tests.
// TF.js prints this via console.warn (which goes to stderr).
for (const method of ["log", "warn"]) {
  const original = console[method];
  console[method] = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Hi, looks like you are running TensorFlow.js in Node.js"
      )
    ) {
      return;
    }
    original.apply(console, args);
  };
}
