
import puppeteer from "puppeteer";

const validRegex = {
  ul: /.*75.*/,
  li: /98.*/,
  div: /.*35/,
}

function isNodeValid(str, node) {
  const regex = validRegex[node];
  return regex.test(str);
}

const getUrl = async () => {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge');

  const result = [];

  //Get all ul nodes;
  const ulNodes = await page.$$("ul");

  // loop through all uls
  await Promise.all(ulNodes.map(async (t) => {

    //get data-tag value
    const dataTag = await t.evaluate(x => x.getAttribute("data-tag"));

    //ask for valid ul
    if(!isNodeValid(dataTag, "ul")){
      return;
    }

    //get the li node
    const liNode = await t.$("li");

    //get the data-id value
    const dataId = await liNode.evaluate(x => x.getAttribute("data-id"));

    //ask for valid li
    if(!isNodeValid(dataId, "li")){
      return;
    }

    //get the div node
    const divNode = await liNode.$("div");

    //get the data-class value
    const dataClass = await divNode.evaluate(x => x.getAttribute("data-class"));

    //ask for valid div
    if(!isNodeValid(dataClass, "div")){
      return;
    }

    //get the span node
    const spanNode = await divNode.$("span");

    //get the value
    const value = await spanNode.evaluate(x => x.getAttribute("value"));

    //save on the array
    result.push(value);
  }))

  
  console.log(result.join(""));
  await browser.close();
}

getUrl();