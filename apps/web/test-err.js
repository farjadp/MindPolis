const fetch = require('node-fetch');
async function test() {
  try {
    const res = await fetch('http://localhost:3000/assessment');
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text.substring(0, 500));
  } catch (e) {
    console.error(e);
  }
}
test();
