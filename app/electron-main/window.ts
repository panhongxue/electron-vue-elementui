import {
	app,
	BrowserWindow,
	BrowserWindowConstructorOptions,
	ipcMain,
	WebPreferences
} from 'electron'
import * as path from 'path'

export class MainWindow {
	private _win: BrowserWindow
	get win(): BrowserWindow | null {
		return this._win
	}

	constructor() {
		const webPreferences: WebPreferences = {
			preload: path.join(__dirname, '../sandbox/preload.js'),
			v8CacheOptions: 'none',
			enableWebSQL: false,
			spellcheck: false,
			nativeWindowOpen: true,
			zoomFactor: 1,
			enableBlinkFeatures: 'HighlightAPI',
			nodeIntegration: true,
			contextIsolation: false
		}
		const options: BrowserWindowConstructorOptions & { experimentalDarkMode: boolean } = {
			width: 1024,
			height: 768,
			x: 208,
			y: 59,
			backgroundColor: '#1e1e1e',
			minWidth: 400,
			minHeight: 270,
			show: true,
			title: 'electron-vue',
			experimentalDarkMode: true,
			// icon: 'c:\\work\\github\\vscode\\resources\\win32\\code_150x150.png',
			titleBarStyle: 'hidden',
			// transparent: true,
			frame: false,
			webPreferences
		}

		// Create the browser window
		this._win = new BrowserWindow(options)

		this.handleEvents()
		this.handleIpcMain()
	}
	handleEvents() {
		this.win.on('maximize', (e) => {
			console.log('maximize')
			this.win.webContents.send('ipc:win-on-maximize')
		})
		this.win.on('unmaximize', (e) => {
			console.log('unmaximize')
			this.win.webContents.send('ipc:win-on-unmaximize')
		})
	}

	handleIpcMain() {
		ipcMain.on('ipc:win-minimize', () => {
			this.win.minimize()
		})
		ipcMain.on('ipc:win-maximize', () => {
			this.win.isMaximized() ? this.win.unmaximize() : this.win.maximize()
		})
		ipcMain.on('ipc:win-close', () => {
			console.log('ipc:win-close')
			// this.win.close()
			// app.quit()
			app.exit()
		})
	}

	load() {
		const isDev = process.env.NODE_ENV === 'development'

		const winurl = isDev
			? 'http://localhost:8080/index.html?main'
			: 'file://' + path.join(__dirname, '../../dist/index.html?main')

			console.log(winurl)

		// Load URL
		this._win.loadURL(winurl)
	}
}
