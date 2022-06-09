#!/usr/bin/env node

const path = require('path'); 
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const TasksJz = require('./tasksjz/index.js');
const db = new TasksJz(path.join(__dirname, 'db.json'));

const messages = {
	add: 'New Task: ',
	remove: 'Indicates the number of the task to remove: ',
	edit: 'Indicates the number of the task to edit: '
}

const init = () => {

	let allTasks = '✓ Tasks: \n';

	db.getAllTasks().forEach(taskObj => allTasks += `\n (${taskObj.id}) ${taskObj.task}`)

	console.log(allTasks, '\n');

	rl.setPrompt('You want to do? (add, remove, edit, exit) => ');
	rl.prompt();

	rl.on('line', (input) => {

		input = input.trim();

		if (input == 'exit') {

			process.exit(); 

		}

		if (!db[input]) {

			rl.prompt();
			return 

		}

		rl.question(messages[input], (text) => {

		  db[input](text.trim());

			console.clear();
			init();

		})

	});

}

init();
