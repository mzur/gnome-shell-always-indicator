const Self = imports.misc.extensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const Settings = Self.imports.Settings.Settings;

class Extension {
   constructor() {
      this.settings = new Settings(Self.metadata['settings-schema']);
      this.indicator = Main.panel.statusArea.dateMenu._indicator;

      this.originalCount = this.indicator._count;
      this.originalStyle = this.indicator.style;
      this.observers = [
         {
            observable: Main.messageTray,
            id: Main.messageTray.connect('source-added', this._onSourceAdded.bind(this)),
         },
         {
            observable: Main.messageTray,
            id: Main.messageTray.connect('source-removed', this._updateCount.bind(this)),
         },
         {
            observable: Main.messageTray,
            id: Main.messageTray.connect('queue-changed', this._updateCount.bind(this)),
         },
         {
            observable: this.settings,
            id: this.settings.connect('changed::color', this._handleColorChanged.bind(this)),
         },
      ];

      this._handleColorChanged();
      this._updateCount();
   }


   destroy() {
      this.indicator._count = this.originalCount;
      this.indicator._sync();
      this.indicator.style = this.originalStyle;
      this.observers.forEach(observer => {
         observer.observable.disconnect(observer.id);
      });
   }

   _onSourceAdded(tray, source) {
      this.observers.push({
         observable: source,
         id: source.connect('notify::count', this._updateCount.bind(this)),
      });
      this._updateCount();
   }

   _updateCount() {
      this.originalCount = this.indicator._count;
      let count = 0;
      this.indicator._sources.forEach(source => (count += source.count));
      this.indicator._count = count;
      this.indicator._sync();
   }

   _handleColorChanged() {
      this.indicator.style = 'color:' + this.settings.get_string('color') + ';';
   }
}

let extension;

function enable() {
   extension = new Extension();
}

function disable() {
   extension.destroy();
   extension = null;
}
