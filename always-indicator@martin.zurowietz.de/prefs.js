const ExtensionUtils = imports.misc.extensionUtils;
const Self = ExtensionUtils.getCurrentExtension();
const Settings = Self.imports.Settings.Settings;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;

const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Self.dir.get_child('settings.ui').get_uri(),
    InternalChildren: ['colorButton'],
}, class PrefsWidget extends Gtk.Box {
   _init(settings, params = {}) {
      super._init(params);
      this._settings = settings;

      let color = this._colorButton.get_rgba();
      color.parse(this._settings.get_string('color'));
      this._colorButton.set_rgba(color);
   }

   _onColorSet(button) {
      this._settings.set_string('color', button.get_rgba().to_string());
   }
});

function init() {
   ExtensionUtils.initTranslations('always-indicator');
}

function buildPrefsWidget() {
   let settings = new Settings(Self.metadata['settings-schema']);

   return new PrefsWidget(settings);
}
