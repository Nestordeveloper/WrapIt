'use strict';

import * as vscode from 'vscode';

function wrapSelectionsInHtmlTags(tag: string): void {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }

    const selections = editor.selections;

    if (selections.length === 0) {
        vscode.window.showErrorMessage('No text selected');
        return;
    }

    selections.forEach((selection) => {
        const selectedText = editor.document.getText(selection);
        const currentLine = selection.active.line;
        const start = new vscode.Position(currentLine, 0);
        const end = new vscode.Position(currentLine + 1, 0);
        const lineText = editor.document.getText(new vscode.Range(start, end));
        const wrappedText = lineText.replace(/<.*?>/, `<${tag}>${selectedText}</${tag}>`);
        editor.edit((editBuilder) => {
            editBuilder.replace(new vscode.Range(start, end), wrappedText);
        });
    });
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.wrapInHtmlTags', () => {
        vscode.window.showInputBox({
            prompt: 'Enter HTML tag name (e.g., div, span, p)',
            placeHolder: 'e.g., div'
        }).then((tag) => {
            if (tag) {
                wrapSelectionsInHtmlTags(tag);
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
