/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check
(function () {
	'use strict';

	const { ipcRenderer, webFrame, contextBridge } = require('electron');

	//#region Utilities

	/**
	 * @param {string} channel
	 * @returns {true | never}
	 */
	function validateIPC(channel) {
		if (!channel || !channel.startsWith('ipc:')) {
			throw new Error(`Unsupported event IPC channel '${channel}'`);
		}

		return true;
	}

	/**
	 * @param {string} type
	 * @returns {type is 'uncaughtException'}
	 */
	function validateProcessEventType(type) {
		if (type !== 'uncaughtException') {
			throw new Error(`Unsupported process event '${type}'`);
		}

		return true;
	}

	/**
	 * @param {string} key the name of the process argument to parse
	 * @returns {string | undefined}
	 */
	function parseArgv(key) {
		for (const arg of process.argv) {
			if (arg.indexOf(`--${key}=`) === 0) {
				return arg.split('=')[1];
			}
		}

		return undefined;
	}

	//#endregion

	//#region Globals Definition

	// #######################################################################
	// ###                                                                 ###
	// ###       !!! DO NOT USE GET/SET PROPERTIES ANYWHERE HERE !!!       ###
	// ###       !!!  UNLESS THE ACCESS IS WITHOUT SIDE EFFECTS  !!!       ###
	// ###       (https://github.com/electron/electron/issues/25516)       ###
	// ###                                                                 ###
	// #######################################################################

	/**
	 */
	const globals = {

		/**
		 * A minimal set of methods exposed from Electron's `ipcRenderer`
		 * to support communication to main process.
		 *
		 * @typedef {import('electron').IpcRendererEvent} IpcRendererEvent
		 *
		 */

		ipcRenderer: {

			/**
			 * @param {string} channel
			 * @param {any[]} args
			 */
			send(channel, ...args) {
				if (validateIPC(channel)) {
					ipcRenderer.send(channel, ...args);
				}
			},

			/**
			 * @param {string} channel
			 * @param {any[]} args
			 * @returns {Promise<any> | undefined}
			 */
			invoke(channel, ...args) {
				if (validateIPC(channel)) {
					return ipcRenderer.invoke(channel, ...args);
				}
			},

			/**
			 * @param {string} channel
			 * @param {(event: IpcRendererEvent, ...args: any[]) => void} listener
			 */
			on(channel, listener) {
				if (validateIPC(channel)) {
					ipcRenderer.on(channel, listener);

					return this;
				}
			},

			/**
			 * @param {string} channel
			 * @param {(event: IpcRendererEvent, ...args: any[]) => void} listener
			 */
			once(channel, listener) {
				if (validateIPC(channel)) {
					ipcRenderer.once(channel, listener);

					return this;
				}
			},

			/**
			 * @param {string} channel
			 * @param {(event: IpcRendererEvent, ...args: any[]) => void} listener
			 */
			removeListener(channel, listener) {
				if (validateIPC(channel)) {
					ipcRenderer.removeListener(channel, listener);

					return this;
				}
			}
		},




	};

	// Use `contextBridge` APIs to expose globals to VSCode
	// only if context isolation is enabled, otherwise just
	// add to the DOM global.
  console.log('iso', process.contextIsolated)
	if (process.contextIsolated) {
		try {
			contextBridge.exposeInMainWorld('sandboxAPI', globals);
		} catch (error) {
			console.error(error);
		}
	} else {
		// @ts-ignore
		window.sandboxAPI = globals;
	}
}());
