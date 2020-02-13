const Self = imports.misc.extensionUtils.getCurrentExtension();
const Main = imports.ui.main;

class Extension {
   constructor() {
      this.indicator = Main.panel.statusArea.dateMenu._indicator;
      this.originalVisible = this.indicator.actor.visible;
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
      ];
   }


   destroy() {
      this.indicator.actor.visible = this.originalVisible;
      this.observers.forEach(observer => {
         observer.observable.disconnect(observer.id);
      });
   }

   _onSourceAdded(tray, source) {
      this.observers.push({
         observable: source,
         id: source.connect('count-updated', this._updateCount.bind(this)),
      });
      this._updateCount();
   }

   _updateCount() {
      this.originalVisible = this.indicator.actor.visible;
      let visible = this.indicator._sources.some(source => { return source.count > 0; });
      this.indicator.actor.visible = visible;
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
