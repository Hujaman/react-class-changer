// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// import { Testfunction } from './src/main'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// const regs = {
	// 	class: /(?:^export\s+)?class.*?{[\s\S]*?^}/gm,
	// (?:^export[\s\S]+?)?class[\s\S]*?{
	// }

	const regs = {
		classDef: /(?:^export[\s\S]+?)?class[\s\S]*?\{/gmu,
	}

	function getIndexes(str,regex, first = false) {
		let output = []
		let match
		while ((match = regex.exec(str)) != null) {
			output.push({
				start: match.index,
				end: regex.lastIndex,
			})
			if (first) return output[0]
		}
		return output.length === 0 && first ? null : output
	}

	function findClosingBracket(str, startIndex, brackets = "{}") {
		let index = startIndex
		let counter = 1

		while (counter > 0) {
			index++
			let value = str[index]
			switch (value) {
				case brackets[0]: counter++
					break
				case brackets[1]: counter--
					break
				default: continue
			}
		}
		return index
	}

	function classFetcher(str) {
		const output = []
		let match

		while ((match = regs.classDef.exec(str)) != null) {
			// Finding the end of the class => index
			let index = regs.classDef.lastIndex

			index = findClosingBracket(str, index)

			output.push({
				type: 'Class',
				export: /^export/g.test(match[0]),
				text: str.slice(match.index, index + 1),
				name: match[0].match(/(?!export|class|\s)\b.+?\b/g)[0],
				global: {
					startClass: match.index,
					startBracket: regs.classDef.lastIndex,
					endBracket: index,
				}			
			})
		}
		return output
	}

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "react-class-changer" is now active!\n');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		let activeEditor = vscode.window.activeTextEditor
		let text
		try {
			text = activeEditor.document.getText()
		} catch(error) {
			vscode.window.showInformationMessage('Please open a file first');
			return
		}
		
		const classes = classFetcher(text)
		console.log("Classes", classes)

		// Display a message box to the user
		vscode.window.showInformationMessage('Classes changed');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
