import { app } from 'electron'
import { MainWindow } from './electron-main/window'

app.once('ready', async () => {
	const window = new MainWindow()
	window.load()
})
