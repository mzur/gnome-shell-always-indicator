const Self = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Self.imports.Settings.Settings;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;

var PrefsWidget = new GObject.Class({
   Name: 'AlwaysIndicator.PrefsWidget',
   GTypeName: 'PrefsWidget',
   Extends: Gtk.Box,

   _init: function(settings, params) {
      this.parent(params);

      this._buildable = new Gtk.Builder();
      this._buildable.add_from_file(Self.path + '/settings.ui');

      let prefsWidget = this._getWidget('prefs_widget');
      this.add(prefsWidget);

      this._settings = settings;
      this._bindColorButtons();
   },

   _getWidget: function(name) {
      let wname = name.replace(/-/g, '_');
      return this._buildable.get_object(wname);
   },

   _getColorButtons: function () {
      return [
        'color',
      ];
   },

   _bindColorButton: function (setting) {
      let widget = this._getWidget(setting);
      let color = Gdk.Color.parse(this._settings.get_string(setting)).pop();
      widget.set_color(color);
      widget.connect('color-set', (button) => {
         let color = button.get_color().to_string();
         color = color[0] + color[1] + color[2] + color[5] + color[6] + color[9] + color[10];
         this._settings.set_string(setting, color);
      });
   },

   _bindColorButtons: function () {
      this._getColorButtons().forEach(this._bindColorButton, this);
   },
});

function init() {

}

function buildPrefsWidget() {
   let settings = new Settings(Self.metadata['settings-schema']);
   let widget = new PrefsWidget(settings);
   widget.show_all();

   return widget;
}
