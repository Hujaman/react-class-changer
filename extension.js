// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// const fs = require('fs')

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
		classDef: /(?:^export[\s\S]+?)?class[\s\S]*?{/gm,
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
		if (first) return null
		return output
	}

	function classDetector(str) {
		const output = []
		let match

		while ((match = regs.classDef.exec(str)) != null) {
			let index = regs.classDef.lastIndex
			let counter = 1

			while (counter > 0) {
				index++
				let value = str[index]
				switch (value) {
					case "{": counter++
						break
					case "}": counter--
						break
					default: continue
				}
			}

			output.push({
				type: 'Class',
				export: getIndexes(match[0], /^export/g, true),
				text: match[0],
				startClass: getIndexes(match[0], /class/g, true),
				startBracket: regs.classDef.lastIndex,
				endBracket: index,
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
		// const text = fs.readFileSync('./testfiles/class.js').toString()
		let activeEditor = vscode.window.activeTextEditor;
		const text = activeEditor.document.getText();
		
		const classes = classDetector(text)
		console.log("Classes", classes)

		// console.log("TEXT", text)
		// Display a message box to the user
		vscode.window.showInformationMessage('TEST');
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
