import puppeteer from "puppeteer";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import Xvfb from 'xvfb';

async function launchAPI() {
	const { stdout: chromiumPath } = await promisify(exec)('which chromium');
	var xvfb = new Xvfb({
  	silent: true
	});
  xvfb.start((err)=>{if (err) console.error(err)})
	const browser = await puppeteer.launch({
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--display='+xvfb._display],
		executablePath: chromiumPath.trim(),
	});

	const url = 'https://chat.lmsys.org/';
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
	await page.reload({ waitUntil: 'networkidle0' });
	return page;
}

async function sendMessage(page, text) {
	await page.waitForSelector('.scroll-hide');
	await page.click('.scroll-hide');
	await page.type('.scroll-hide', text); // hit Enter after typing
	await page.waitForSelector('#component-10 button');
	await page.click('#component-10 button');
}

async function getAllMessages(page) {
	await page.waitForFunction(() => {
		const messages = document.querySelectorAll('.message');
		const lastMessage = messages[messages.length - 1];
		return lastMessage.classList.contains('bot');
	}, { timeout: 600 * 1000 });
	await page.waitForSelector('#component-12 button:not([disabled])', { timeout: 600 * 1000 });
	
	const allMessages = await page.$$eval('.message', elems => elems.map(elem => elem.textContent));

	return allMessages;
}


export { launchAPI, sendMessage, getAllMessages };
