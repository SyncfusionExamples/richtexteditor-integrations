import { RichTextEditorComponent, RichTextEditorModule, ToolbarSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';
import { Component, ViewChild } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService, CodeBlockService } from '@syncfusion/ej2-angular-richtexteditor';
import hljs from 'highlight.js/lib/common';

@Component({
  imports: [RichTextEditorModule],
  standalone: true,
  selector: 'app-root',
  template: `
    <ejs-richtexteditor
      #rte
      [value]="initialHtml"
       [toolbarSettings]='tools'
      (created)="onCreated()"
      (change)="onChange()"
    ></ejs-richtexteditor>
  `,
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService, CodeBlockService],
})
export class App {
  @ViewChild('rte', { static: true })
  public rte: RichTextEditorComponent | undefined;
  public tools: ToolbarSettingsModel = {
    items: ['Undo', 'Redo', '|', 'CodeBlock', '|', 'InsertCode','Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', '|', 'CreateLink', 'Image', 'CreateTable', 'Blockquote', '|', 'BulletFormatList', 'NumberFormatList', '|', 'Formats', 'Alignments', '|', 'Outdent', 'Indent', '|',
      'FontColor', 'BackgroundColor', 'FontName', 'FontSize', '|', 'SourceCode']
  };
  public initialHtml = `
    <p>Welcome! Here are some preloaded code blocks:</p>

    <p><strong>No language class</strong> (auto-detect):</p>
    <pre><code>
      SELECT id, name FROM users WHERE active = 1;
    </code></pre>

    <p><strong>Language class (TypeScript)</strong>:</p>
    <pre><code class="language-typescript">
      export function hello(name: string) {
        console.log('Hello ' + name);
      }
    </code></pre>

    <p><strong>Language class (Python)</strong>:</p>
    <pre><code class="language-python">
      def sum(a, b):
        return a + b
    </code></pre>
    <pre><code class="language-cpp">
#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;

    int a = 10;
    int b = 20;
    int sum = a + b;

    cout << "Sum = " << sum << endl;
    return 0;
}
</code></pre>
  `;

  onCreated() {
    // Highlight existing code blocks at startup
    this.highlightAllCodeBlocks();
  }

  onChange() {
    this.highlightAllCodeBlocks()
  }

  private highlightAllCodeBlocks() {
    const container = this.rte!.element.querySelector('.e-rte-content .e-content') as HTMLElement | null;
    if (!container) return;
    const blocks = container.querySelectorAll<HTMLElement>('pre code');
    blocks.forEach((el) => {
      const hasLanguageClass = /\blanguage-/.test(el.className || '');
      try {
        if (hasLanguageClass) {
          // Language explicitly provided
          hljs.highlightElement(el);
        } else {
          // No language → auto-detect
          const result = hljs.highlightAuto(el.textContent ?? '');
          el.innerHTML = result.value;
          el.classList.add('hljs');
        }
      } catch {
        // Graceful fallback
        el.classList.add('hljs');
      }
    });
  }

}
