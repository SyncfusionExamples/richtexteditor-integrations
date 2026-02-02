import { Component, ViewChild } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import WProofreader from '@webspellchecker/wproofreader-sdk-js';

@Component({
  imports: [
    RichTextEditorAllModule
  ],
  selector: 'app-root',
  template: `<ejs-richtexteditor #spellEditor id='editor' [value]='value'>
  </ejs-richtexteditor>`,

  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})

export class App {
  @ViewChild("spellEditor")
  public spellEditor!: RichTextEditorComponent;
  title = 'WebSpellChecker-RichTextEditor';
  private wpcInstance: any;
  ngAfterViewInit(): void {
    const container = this.spellEditor.inputElement as HTMLElement;
    this.wpcInstance = WProofreader.init({
      container: this.spellEditor.inputElement,
      lang: 'en_US',
      serviceId: 'YOUR_SERVICE_ID',
    });
  }
  ngOnDestroy(): void {
    if (this.wpcInstance && typeof this.wpcInstance.destroy === 'function') {
      this.wpcInstance.destroy();
      return;
    }
  }

  public value: string = "<p>Enter you\'re text here with real spelling and grammer mistakes to see how WProofreader work. Alot of potential errors will be underlined; hover on the marked wods for instant correction suggesstions.</p>";
}