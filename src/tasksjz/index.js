const fs = require('fs');
const cmd = require('child_process');

/**
 * Allows adding, removing and editing tasks from a JSON file.
*/
const TasksJz = class {

	/**
	 * Save the parsed JSON file data to "this._db".
	 * @param {String} dbPath - Path of the JSON file that will have the tasks.
	*/
	constructor (dbPath) {

		this._dbPath = dbPath;
		this._db = JSON.parse(fs.readFileSync(this._dbPath, 'utf-8'));

	}

	/**
	 * Return all tasks. (db)
	 * @returns {Array<String>} 
	*/
	getAllTasks () {

		return this._db;

	}
 
	/**
	 * Checks if a task exists or not, returns "true" if it exists and "false" otherwise.
	 * @param {String} task - Is the task that will be checked if it exists.
	 * @returns {Boolean}
	*/
	_existsTask (task) {

		return this._db.map(taskObj => taskObj.task).includes(task);

	}

	/**
	 * Update the JSON file. (db)
	*/
	_updateDB () {

		fs.writeFileSync(this._dbPath, JSON.stringify(this._db, null, 2));

	}

	/**
	 * Add a new task if it doesn't exist.
	 * @param {String} task - It's the task to add.
	*/
	add (task) {

		if (!this._existsTask(task)) {

			this._id = this._db.length + 1;

			this._db.push({
				id: this._id,
				task: task
			});

			this._updateDB();

		}

	}

	/**
	 * Remove a task if it exists.
	 * @param {Number} id - Is the number of the task to remove.
	*/
	remove (id) {

		if (this._db[id - 1]) {

			this._db.splice(id - 1, 1);
			this._db.forEach( (taskObj, index) => taskObj.id = index + 1);
			
			this._updateDB();

		}

	}

	/**
	 * Edit a task if it exists.
	 * @param {Number} id - Is the number of the task to edit.
	*/
	edit (id) {

		if (this._db[id - 1]) {

			const taskTemporaryPath = 'task-temp.txt';

			fs.writeFileSync(taskTemporaryPath, this._db[id - 1].task);

			cmd.spawnSync('nvim', [taskTemporaryPath], {
				stdio: 'inherit',
				dateched: true
			});

			const updatedTask = fs.readFileSync(taskTemporaryPath, 'utf-8').trim();

			this._db[id - 1].task = updatedTask;

			this._updateDB();

			fs.rmSync(taskTemporaryPath);

		}

	}

}

module.exports = TasksJz;
