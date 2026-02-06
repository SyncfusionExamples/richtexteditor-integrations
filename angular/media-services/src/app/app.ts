import { Component } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, AudioService, VideoService, AudioSettingsModel, ImageSettingsModel, RichTextEditorModule, VideoSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-root',
  imports: [RichTextEditorModule],
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
    saveUrl: 'https://localhost:7021/api/RichTextEditor/SaveFile',
    path: 'https://localhost:7021/api/RichTextEditor/'
  }
  public insertVideoSettings: AudioSettingsModel = {
    saveUrl: 'https://localhost:7021/api/RichTextEditor/SaveFile',
    path: 'https://localhost:7021/api/RichTextEditor/'
  }
  public insertAudioSettings: VideoSettingsModel = {
    saveUrl: 'https://localhost:7021/api/RichTextEditor/SaveFile',
    path: 'https://localhost:7021/api/RichTextEditor/'
  }
}
