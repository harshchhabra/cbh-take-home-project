const crypto = require("crypto");
const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

/**
 * I have used tenanry operators insetad of if conditions where required. I optimized the lines of code to make
 * the code more readable easily. I have also removed extra conditions which is not required. I also added formatting
 * to the code. define the const outside function.
 * @param {*} event
 * @returns
 */
exports.deterministicPartitionKey = (event) => {
  let candidate = null;
  if (event) {
    candidate = event?.partitionKey
      ? event.partitionKey
      : crypto
          .createHash("sha3-512")
          .update(JSON.stringify(event))
          .digest("hex");
  }
  candidate =
    candidate && typeof candidate !== "string"
      ? JSON.stringify(candidate)
      : TRIVIAL_PARTITION_KEY;
  return candidate.length > MAX_PARTITION_KEY_LENGTH
    ? crypto.createHash("sha3-512").update(candidate).digest("hex")
    : candidate;
};