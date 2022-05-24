const path = require('path')
const fs = require('fs')
const pkg = require('../package.json')
const { execSync } = require('child_process')
const Service = require('@vue/cli-service/lib/Service')

;(async function () {
	const nodeMain = path.join(__dirname, '../', pkg.main)
	if (!fs.existsSync(nodeMain)) {
		console.log('build ts')
		execSync('node node_modules/typescript/lib/tsc.js')
	}

	const html = path.join(__dirname, '../dist/index.html')
	if (!fs.existsSync(html)) {
		const service = new Service(process.cwd())
		console.log('build Vue')
		await service.run('build')
	}
})()
