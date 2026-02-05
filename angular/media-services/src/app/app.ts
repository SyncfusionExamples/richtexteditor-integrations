import { Component } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, AudioService, VideoService, AudioSettingsModel, ImageSettingsModel, RichTextEditorModule, VideoSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';
import { TabModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations'

@Component({
  selector: 'app-root',
  imports: [RichTextEditorModule, TabModule],
  template:
    `
    <ejs-richtexteditor [toolbarSettings]='tools'   [insertImageSettings]="insertImageSettings"  [insertAudioSettings]="insertAudioSettings"  [insertVideoSettings]= "insertVideoSettings" ></ejs-richtexteditor>
    `,
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, AudioService, VideoService],
})
export class App {
  public tools: ToolbarModule = {
    items: ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'Blockquote', 'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', 'Audio', 'Video', '|', 'SourceCode', 'Undo', 'Redo']
  };
  public insertImageSettings: ImageSettingsModel = {
    saveUrl: 'http://localhost:62869/api/RichTextEditor/SaveFile',
    path: 'http://localhost:62869/api/RichTextEditor/'
  }
  public insertVideoSettings: AudioSettingsModel = {
    saveUrl: 'http://localhost:62869/api/RichTextEditor/SaveFile',
    path: 'http://localhost:62869/api/RichTextEditor/'
  }
  public insertAudioSettings: VideoSettingsModel = {
    saveUrl: 'http://localhost:62869/api/RichTextEditor/SaveFile',
    path: 'http://localhost:62869/api/RichTextEditor/'
  }
}
