'use strict';

var find = require('lodash/collection/find'),
    ace = global.ace,
    React = require('react'),
    ReactDOM = require('react-dom'),
    App = require('./components/app'),
    constants = require('./constants');

function createFileSession(item) {
  if (item.type === 'file') {
    if (item.session) {
      return item.session;
    }
    else {
      var fileLanguage = (constants.MODES[item.language] || item.language),
          session = new ace.EditSession(item.content, 'ace/mode/' + fileLanguage);

      session.$id = fileLanguage + '-' + item.name;
      session.setOptions({
        firstLineNumber: 1,
        indentedSoftWrap: true,
        newLineMode: "auto",
        overwrite: false,
        tabSize: 2,
        useSoftTabs: true,
        useWorker: true,
        wrap: "off",
        wrapMethod: "auto"
      });

      session.setUndoManager(new ace.UndoManager());
      session.setValue(item.content || '');
      session.setUseWrapMode(true);

      return session;
    }
  }
}

function addItem(newItem) {
  this.items.push(newItem);

  if (newItem.isVisible === undefined) {
    newItem.isVisible = true;
  }

  if (newItem.type === 'file') {
    newItem.session = createFileSession(newItem);
  }
}

function addFile(newFile) {
  newFile.type = 'file';
  newFile.session = createFileSession(newFile);

  this.addItem(newFile);
}

function addLibrary(newLibrary) {
  this.libraries.push(newLibrary);
}

function findItem(name) {
  return find(this.items, function(item) { return item.name === name; });
}

function findFile(name) {
  return find(this.items, function(item) { return item.type === 'file' && item.name === name; });
}

function selectItem(item) {
  var activeItem = this.items.find(function(item) { return item.isActive });

  activeItem.isActive = false;
  item.isActive = true;

  if (item.type === 'file' && item.session && this.editor) {
    this.editor.setSession(item.session);
    this.editor.focus();
  }

  this.render();
}

function render() {
  if (this.element) {
    this.view = ReactDOM.render(React.createElement(App, { codeBasket: this }), this.element);
  }
}

module.exports = {
  addItem: addItem,
  addFile: addFile,
  addLibrary: addLibrary,
  findItem: findItem,
  findFile: findFile,
  selectItem: selectItem,
  render: render
};