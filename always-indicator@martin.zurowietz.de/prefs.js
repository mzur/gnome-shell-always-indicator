const ExtensionUtils = imports.misc.extensionUtils;
const Self = ExtensionUtils.getCurrentExtension();
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;

const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Self.dir.get_child('settings.ui').get_uri(),
    InternalChildren: ['colorButton'],
}, class PrefsWidget extends Gtk.Box {
   _init(params = {}) {
      super._init(params);
      this._settings = ExtensionUtils.getSettings(Self.metadata['settings-schema']);

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
   return new PrefsWidget();
}
