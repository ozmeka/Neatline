
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Geometry editing module.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Modules.Geometry = (function(Backbone, Editor, Neatline) {

  var Geometry = {};


  /*
   * Alias the exhibit map view.
   *
   * @return void.
   */
  Geometry.init = function() {
    this.view = Neatline.Modules.Map.view;
  };


  // -------
  // Events.
  // -------

  /*
   * Show form on map feature click.
   *
   * @param {Object} model: The record model.
   * @param {Boolean} focus: If true, focus the map on the edit layer.
   *
   * @return void.
   */
  Editor.vent.on('form:open', function(model, focus) {
    Geometry.view.freeze(model.get('id'));
    Geometry.view.startEdit(model, focus);
  });

  /*
   * Close form.
   *
   * @param {Object} model: The record model.
   *
   * @return void.
   */
  Editor.vent.on('form:close', function(model) {
    Geometry.view.unFreeze(model.get('id'));
    Geometry.view.endEdit();
  });

  /*
   * Update map settings.
   *
   * @param {Object} settings: Settings hash.
   *
   * @return void.
   */
  Editor.vent.on('form:updateMap', function(settings) {
    Geometry.view.update(settings);
  });


  // Export.
  Editor.addInitializer(function() { Geometry.init(); });
  return Geometry;

})(Backbone, Editor, Neatline);
