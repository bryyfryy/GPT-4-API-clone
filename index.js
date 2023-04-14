import { launchAPI, sendMessage, getAllMessages } from './api.js';
import readline from 'readline';
import ora from 'ora';

async function main() {
  // Launch the browser and navigate to the chat URL
  const page = await launchWithLoader();

  while (true) {
    const userInput = await getUserInput();
    if (!userInput) {
      break;
    }

  	const spinner = ora('Generating...').start();
		
    // Send the user input as a message
    await sendMessage(page, userInput);

    // Get all messages in the chat
    const allMessages = await getAllMessages(page);

    const botResponse = allMessages[allMessages.length - 1];

		
  	spinner.stop();
    console.log(`Bot: ${botResponse.trim()}`);
  }
}

async function launchWithLoader() {
  const spinner = ora('Loading...').start();

  const page = await launchAPI();

  spinner.stop();
  return page;
}

async function getUserInput() {
  const input = await new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("You: ", (input) => {
      rl.close();
      resolve(input);
    });
  });
  return input;
}

main();