const { spawn, exec } = require('child_process')
const electron = require('electron')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const pkg = require('../package.json')
const Service = require('@vue/cli-service/lib/Service')
const service = new Service(process.cwd())

let electronProcess = null
let electronRestart = false

/**
 * 监听electron文件变化，重启app
 */
function watchFile() {
	fs.watch(
		path.join(__dirname, '../', path.dirname(pkg.main)),
		{
			recursive: true
		},
		function (eventType, filename) {
			electronRestart = true
			if (electronProcess && electronProcess.pid) {
				process.kill(electronProcess.pid)
			}
			electronProcess = null
			console.log(chalk.green(eventType + ':' + filename))
			startElectron()
			console.log(chalk.green('app restart'))
			setTimeout(() => {
				electronRestart = false
			}, 5000)
		}
	)
}

function startVue() {
	return service.run('serve').catch((err) => {
		console.log(chalk.red(err))
		process.exit(1)
	})
}

function startElectron() {
	electronProcess = spawn(
		electron,
		['.']
		// , {
		//   env: {
		//     NODE_ENV: 'development'
		//   }
		// }
	)

	electronProcess.stdout.on('data', (data) => {
		console.log(chalk.green(data.toString()))
	})
	electronProcess.stderr.on('data', (data) => {
		console.log(chalk.red(data.toString()))
	})
	electronProcess.on('close', () => {
		if (!electronRestart) process.exit()
	})
}

function init() {
	let firstCompiled = true
	const tscProc = exec('tsc -w')
	tscProc.stdout.on('data', (data) => {
		console.log(chalk.blue(data))
		if (firstCompiled && data.includes('Watching for file changes')) {
			firstCompiled = false

			startVue().then(() => {
				watchFile()
				startElectron()
				console.log(chalk.green(' app start'))
			})
		}
	})
}
init()
