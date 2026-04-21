# richtexteditor-integrations

## Repository Description

A comprehensive collection of example projects demonstrating seamless integration of Syncfusion EJ2 Rich Text Editor with popular third-party libraries including Codemirror, Embedly, Image Editor, Mention, and Web Spell Checker components. Each example showcases best practices for extending the rich text editor's functionality in Angular applications.

## Prerequisites

- Node.js v18+, npm v9+
- .NET SDK v8.0 (for backend)
- Angular CLI v21.0+
- Syncfusion EJ2 packages

## Installation & Setup

### Angular Examples

```bash
cd angular
npm install
ng serve
```

### Backend Services (.NET)

```bash
cd angular/mention-remote-data/backend
dotnet build
dotnet run
```

## Project Structure

- **mention**: RTE integration with Mention component for user/object references
- **mention-remote-data**: Full-stack example with Angular frontend and .NET backend API for remote data fetching
- **web-spell-checker**: RTE integration with spell checker functionality

## Key Features

- EJ2 Rich Text Editor core functionality
- Advanced extensions: Codemirror, Embedly, Image Editor
- Spell checking and user mention systems
- Remote data binding patterns
- Full-stack Angular and .NET examples
