<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { RichTextEditor, Toolbar, Link, Image, HtmlEditor, QuickToolbar } from '@syncfusion/ej2-richtexteditor';
  
  RichTextEditor.Inject(Toolbar, Link, Image, HtmlEditor, QuickToolbar);
  
  let value: string = '<p>The Rich Text Editor control is WYSIWYG ("what you see is what you get") editor that provides the best user experience to create and update the content.Users can format their content using standard toolbar commands.</p><p><b> Key features: </b></p><ul><li><p>Provides IFRAME and DIV modes </p></li><li><p>Capable of handling markdown editing.</p></li><li><p>Contains a modular library to load the necessary functionality on demand.</p></li><li><p>Provides a fully customizable toolbar.</p></li><li><p>Provides HTML view to edit the source directly for developers.</p></li><li><p>Supports third - party library integration.</p></li><li><p>Allows preview of modified content before saving it.</p></li><li><p>Handles images, hyperlinks, video, hyperlinks, uploads, etc.</p></li></ul>';
  let width: string = '1200px';
  
  let editorElement: HTMLElement;
  let rteInstance: RichTextEditor;
  
  onMount(() => {
    rteInstance = new RichTextEditor({
      width: width,
      value: value,
      toolbarSettings: { items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', 'FontName', 'FontSize', 'FontColor', 'BackgroundColor', 'LowerCase', 'UpperCase', '|', 'Formats',
      'Alignments', 'OrderedList', 'UnorderedList', 'Outdent', 'Indent', '|', 'CreateLink', 'Image', '|', 'ClearFormat', 'Print', 'SourceCode', 'FullScreen', '|', 'Undo', 'Redo'] },
    });
    rteInstance.appendTo(editorElement);
  });
  
  onDestroy(() => {
    if (rteInstance) {
      rteInstance.destroy();
    }
  });
</script>

<main>
  <div class="editor-container">
    <h2>Rich Text Editor Demo</h2>
    <div bind:this={editorElement}></div>
  </div>
</main>

<style>
  main {
    padding: 2rem;
  }
</style>
