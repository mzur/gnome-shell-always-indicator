import {Extension as BaseExtension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {panel} from 'resource:///org/gnome/shell/ui/main.js';

export default class AlwaysIndicatorExtension extends BaseExtension {
   enable() {
      this._settings = this.getSettings();
      this._customStyle = '';
      this._indicator = panel.statusArea.dateMenu._indicator;
      this._originalStyle = this._indicator.style;

      this._originalUpdateCount = this._indicator._updateCount;
      this._indicator._updateCount = this._updateCountOverride.bind(this);

      this._originalSync = this._indicator._sync;
      this._indicator._sync = this._syncOverride.bind(this);

      this._observers = [
         {
            item: this._indicator._settings,
            id: this._indicator._settings.connect('changed::show-banners', this._indicator._sync),
         },
         {
            item: this._settings,
            id: this._settings.connect('changed::color', this._handleColorChanged.bind(this)),
         },
      ];

      this._handleColorChanged();
      this._indicator._updateCount();
   }

   disable() {
      this._indicator._updateCount = this._originalUpdateCount;
      this._indicator._sync = this._originalSync;
      this._indicator.style = this._originalStyle;
      this._indicator._updateCount();

      this._observers.forEach(o => o.item.disconnect(o.id));
      this._observers = null;
      this._settings = null
      this._customStyle = null;
      this._originalStyle = null;
      this._observerId = null;
   }

   _updateCountOverride() {
      let count = 0;
      this._indicator._sources.forEach(source => (count += source.count));
      this._indicator._count = count;
      this._indicator._sync();
   }

   _syncOverride() {
      this._originalSync.call(this._indicator);
      if (this._indicator._count === 0 && !this._indicator._settings.get_boolean('show-banners')) {
         this._indicator.style = this._originalStyle;
      } else {
         this._indicator.style = this._customStyle;
      }
   }

   _handleColorChanged() {
      const color = this._settings.get_string('color');
      this._customStyle = `color: ${color};`;
      this._indicator._sync();
   }
}
