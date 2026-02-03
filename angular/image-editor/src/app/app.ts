import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ImageEditorModule } from '@syncfusion/ej2-angular-image-editor';
import { DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, NodeSelection, RichTextEditorComponent, RichTextEditorModule, QuickToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { getComponent } from '@syncfusion/ej2-base';
import { ImageEditor } from '@syncfusion/ej2-image-editor';
@Component({
    selector: 'app-root',
    template: `
<div class="control-section">
    <ejs-richtexteditor
     #toolsRTE
     [showCharCount]="true"
     [quickToolbarSettings]="quickToolbarSettings"
     (toolbarClick)="toolbarClick($event)"
   >
     <ng-template #valueTemplate>
       <p>
        An image can be edited within a Rich Text Editor using an Image Editor.
         <img
           id="img1"
           style="height: 350px; width: 300px;"
           src="https://picsum.photos/600/400"
           aria-label="Bridge"
         />
       </p>
       <p>
        It allows users to quickly and easily add an Image Editor to their Rich Text Editor.
        It provides a variety of features, including image cropping, resizing, rotation, and more.
        Additionally, it supports a wide range of image formats, including JPEG, PNG, and GIF.
       </p>
     </ng-template>
   </ejs-richtexteditor>
</div>

<ejs-dialog
     #Dialog
     [buttons]="dlgButtons"
     (beforeOpen)="OnBeforeOpen()"
     (open)="open()"
     [header]="header"
     [visible]="false"
     [showCloseIcon]="true"
     width="800px"
     height="800px"
     [isModal]="true"
     (close)="onclose()"
   >
     <ng-template #content>
       <ejs-imageeditor #ImageEditor id="image-editor" height="500px">
       </ejs-imageeditor>
     </ng-template>
   </ejs-dialog>`,
    styleUrl: 'app.css',
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService ],
    standalone: true,
    imports: [RichTextEditorModule, DialogModule, ImageEditorModule]
})
export class App {
    @ViewChild('toolsRTE')
    public defaultRTE?: RichTextEditorComponent;
    @ViewChild('Dialog')
    public dialogObj?: DialogComponent;
    @ViewChild('ImageEditor')
    public imageEditorObj?: ImageEditor;
    public selection = new NodeSelection();
    public header = 'Image Editor';
    public range?: Range;
    public saveSelection?: NodeSelection;
    public dataURL?: null;
    public isLoaded = false;
    public imageELement: any;
    public dlgButtons = [
        {
            buttonModel: { content: 'Insert', isPrimary: true },
            click: this.onInsert.bind(this),
        },
        { buttonModel: { content: 'Cancel' }, click: this.onCancel.bind(this), },
    ];

    public quickToolbarSettings = {
        image: [
            'Replace',
            'Align',
            'Caption',
            'Remove',
            '|',
            'InsertLink',
            'OpenImageLink',
            'EditImageLink',
            'RemoveImageLink',
            'Display',
            'AltText',
            {
                tooltipText: 'Image Editor',
                template:
                    '<button class="e-tbar-btn e-btn" id="imageEditor"><span class="e-btn-icon e-icons e-rte-image-editor"></span></button>',
            },
        ],
    };

    public toolbarClick(args: any): void {
        if (args.item.tooltipText === 'Image Editor') {
            this.range = this.selection.getRange(document);
            this.saveSelection = this.selection.save(this.range, document);
            this.dialogObj!.show();
            this.defaultRTE!.quickToolbarModule.imageQTBar.hidePopup();
        }
    }

    public onInsert(): void {
        if (this.defaultRTE!.formatter!.getUndoRedoStack?.()!.length === 0) {
            this.defaultRTE!.formatter!.saveData?.();
        }
        this.saveSelection?.restore();
        var canvas = document.createElement('CANVAS');
        var ctx = (canvas as any).getContext('2d');
        var imgData: ImageData = (this.imageEditorObj as any).getImageData();
        (canvas as any).height = imgData.height;
        (canvas as any).width = imgData.width;
        ctx.putImageData(imgData, 0, 0);
        this.isLoaded = true;
        this.defaultRTE!.executeCommand('editImage', {
            url: (canvas as any).toDataURL(),
            width: { width: (canvas as any).width },
            height: { height: (canvas as any).height },
            selection: this.saveSelection,
            cssClass: this.imageELement.getAttribute('class').replace('e-rte-image', '')
        });
        this.defaultRTE!.formatter!.saveData!();
        this.defaultRTE!.formatter!.enableUndo!(this.defaultRTE);
        this.dispose();
        this.dialogObj!.hide();
    }

    public onCancel(): void {
        this.dispose();
        this.dialogObj!.hide();
        this.isLoaded = true;
    }

    public onclose() {
        this.dispose();
        this.dialogObj!.hide();
        this.isLoaded = true;
    }

    public open(): void {
        this.imageEditorObj!.update();
        this.imageEditorObj!.open(this.dataURL!);
    }

    public OnBeforeOpen(): void {
        this.dispose();
        this.isLoaded = false;
        let selectNodes: any[] = [];
        if (this.defaultRTE!.formatter!.editorManager!.nodeSelection) {
            selectNodes = this.defaultRTE!.formatter!.editorManager!.nodeSelection!.getNodeCollection(this.range!);
        }
        if (selectNodes.length == 1 && (selectNodes[0] as any).tagName == 'IMG') {
            this.imageELement = selectNodes[0];
            this.imageELement.crossOrigin = 'anonymous';
            var canvas = document.createElement('CANVAS');
            var ctx = (canvas as any).getContext('2d');
            (canvas as any).height = this.imageELement.offsetHeight;
            (canvas as any).width = this.imageELement.offsetWidth;
            var imageELe = this.imageELement;
            var isLoded = this.isLoaded;
            this.imageELement.onload = () => {
                ctx.drawImage(
                    imageELe,
                    0,
                    0,
                    (canvas as any).width,
                    (canvas as any).height
                );
                this.dataURL = (canvas as any).toDataURL();
            };
            if (isLoded !== undefined && !isLoded) {
                this.imageEditorObj = new ImageEditor({
                    height: '450px'
                });
                this.imageEditorObj.appendTo('#image-editor');
                isLoded = true;
            }
        }
    }

    public dispose(): void {
        var imageEditorInstance = getComponent(document.getElementById('image-editor') as HTMLElement, 'image-editor') as ImageEditor;
        if (imageEditorInstance !== null && imageEditorInstance !== undefined) {
            imageEditorInstance.destroy();
        }
    }
}