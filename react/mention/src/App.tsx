import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { MentionComponent } from '@syncfusion/ej2-react-dropdowns';
import * as React from 'react';
import './App.css';

type EmailMention = {
  name: string;
  initial: string;
  email: string;
  color: string;
  bgColor: string;
};

class App extends React.Component {
  private popupWidth: string = '250px';
  private emailData: EmailMention[] = [
    { name: "Selma Rose", initial: 'SR', email: "selma@gmail.com", color: '#FAFDFF', bgColor: '#01579B' },
    { name: "Maria", initial: 'MA', email: "maria@gmail.com", color: '#004378', bgColor: '#ADDBFF' },
    { name: "Russo Kay", initial: 'RK', email: "russo@gmail.com", color: '#F9DEDC', bgColor: '#8C1D18' },
    { name: "Robert", initial: 'RO', email: "robert@gmail.com", color: '#FFD6F7', bgColor: '#37003A' },
    { name: "Camden Kate", initial: 'CK', email: "camden@gmail.com", color: '#FFFFFF', bgColor: '#464ECF' },
    { name: "Garth", initial: 'GA', email: "garth@gmail.com", color: '#FFFFFF', bgColor: '#008861' },
    { name: "Andrew James", initial: 'AJ', email: "james@gmail.com", color: '#FFFFFF', bgColor: '#53CA17' },
    { name: "Olivia", initial: 'OL', email: "olivia@gmail.com", color: '#FFFFFF', bgColor: '#8C1D18' },
    { name: "Sophia", initial: 'SO', email: "sophia@gmail.com", color: '#000000', bgColor: '#D0BCFF' },
    { name: "Margaret", initial: 'MA', email: "margaret@gmail.com", color: '#000000', bgColor: '#F2B8B5' },
    { name: "Ursula Ann", initial: 'UA', email: "ursula@gmail.com", color: '#000000', bgColor: '#47ACFB' },
    { name: "Laura Grace", initial: 'LG', email: "laura@gmail.com", color: '#000000', bgColor: '#FFE088' },
    { name: "Albert", initial: 'AL', email: "albert@gmail.com", color: '#FFFFFF', bgColor: '#00335B' },
    { name: "William", initial: 'WA', email: "william@gmail.com", color: '#FFFFFF', bgColor: '#163E02' }
  ];
  private itemTemplate(data: EmailMention): React.JSX.Element {
    return (
      <div className="editor-mention-item-template">
        <div className="em-header">
          <div className="em-avatar" style={{ backgroundColor: data.bgColor, color: data.color }}>
            <div className="em-initial">{data.initial}</div>
          </div>
        </div>
        <div className="em-content">
          <div className="em-name">{data.name}</div>
          <div className="em-email">{data.email}</div>
        </div>
      </div>
    );
  }

  private displayTemplate(data: EmailMention): React.JSX.Element {
    return (
      <a href={"mailto:" + data.email} title={data.email}>@{data.name}</a>
    );
  }
  fieldsData = { text: 'name' };
  rteValue = "<p>Hello <span contenteditable=\"false\" class=\"e-mention-chip\"><a href=\"mailto:maria@gmail.com\" title=\"maria@gmail.com\">&#64;Maria</a></span>&#8203;</p><p>Welcome to the mention integration with rich text editor demo. Type <code>&#64;</code> character and tag user from the suggestion list.</p>";
  render() {
    return (
    <div className='control-pane'>
      <div className='control-section' id="rte">
        <div className='rte-control-section'>
          <RichTextEditorComponent id="mention_integration" value={this.rteValue} placeholder="Type @ and tag the name">
            <Inject services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]} />
          </RichTextEditorComponent>
        </div>
      </div>
       <MentionComponent id="mentionEditor" target="#mention_integration_rte-edit-view" dataSource={this.emailData} displayTemplate={this.displayTemplate} itemTemplate={this.itemTemplate} fields={{ text: 'name' }} popupWidth= {this.popupWidth} popupHeight='200px' sortOrder='Ascending' allowSpaces={true} suffixText={'&nbsp;'}></MentionComponent>
    </div>
    );
  }
}
export default App