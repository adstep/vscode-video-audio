'use strict';

import * as vscode from 'vscode';
import { TextDocumentContentProvider, EventEmitter, Uri, Event, CancellationToken } from 'vscode';

export class TestContentProvider implements TextDocumentContentProvider {
    private _onDidChange = new EventEmitter<Uri>();

    get onDidChange(): Event<Uri> {
        return this._onDidChange.event;
    }

    update(uri: Uri) {
        this._onDidChange.fire(uri);
    }

    provideTextDocumentContent(uri: Uri, token: CancellationToken): string | Thenable<string> {
        return `
        <html>
            <body>
                <audio controls autoplay src="http://media.w3.org/2010/07/bunny/04-Death_Becomes_Fur.oga"></audio>
                <video controls autoplay>
                    <source src="http://media.w3.org/2010/05/sintel/trailer.mp4"
                        type='video/mp4; codecs="avc1, mp4a"'>
                    <source src="http://media.w3.org/2010/05/sintel/trailer.ogv"
                        type='video/ogg; codecs="theora, vorbis"'>
                </video>
            </body>
        </html>
        `;
    }
}

export function activate(context: vscode.ExtensionContext) {
    const testUri = vscode.Uri.parse('vscode-video-audio://authority/vscode-video-audio');
    const provider = new TestContentProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider('vscode-video-audio', provider);
    provider.update(testUri);

    const disposable = vscode.commands.registerCommand('extension.testPreviewHtml', () => {
        vscode.commands.executeCommand('vscode.previewHtml', testUri, vscode.ViewColumn.One).then(
            (success) => { },
            (reason) => { vscode.window.showErrorMessage(reason)}
        );
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}