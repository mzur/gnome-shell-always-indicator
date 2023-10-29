import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

export default class Prefs extends ExtensionPreferences {
   fillPreferencesWindow(window) {
      let settings = this.getSettings();
      window._settings = settings;
      const page = new Adw.PreferencesPage();
      const group = new Adw.PreferencesGroup();
      page.add(group);

      const row = new Adw.ActionRow({
         title: _('Color of the message indicator'),
      });
      const dialog = new Gtk.ColorDialog();
      dialog.set_modal(true);
      const button = new Gtk.ColorDialogButton({dialog});
      row.add_suffix(button);
      group.add(row);

      let color = button.get_rgba();
      color.parse(settings.get_string('color'));
      button.set_rgba(color);

      button.connect('notify::rgba', () => {
         settings.set_string('color', button.get_rgba().to_string());
      });

      window.add(page);
   }
}
