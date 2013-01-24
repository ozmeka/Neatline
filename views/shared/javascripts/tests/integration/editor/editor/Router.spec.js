
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor router test.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Router', function() {


  beforeEach(function() {
    _t.loadEditor();
  });


  describe('#records', function() {

    // --------------------------------------------------------------------
    // #records should display the editor menu, search, and record list.
    // --------------------------------------------------------------------

    afterEach(function() {

      // Menu, search, records should be visible.
      expect(_t.el.editor).toContain(_t.el.menu);
      expect(_t.el.editor).toContain(_t.el.search);
      expect(_t.el.editor).toContain(_t.el.records);

      // "Records" tab should be active.
      expect(_t.vw.menu.__ui.tabs.records).toHaveClass('active');

    });

    it('default', function() {
      _t.navigate('records');
    });

    it('query', function() {
      _t.navigate('records/search/query=test');
      expect(_t.vw.search.__ui.search).toHaveValue('test');
    });

    it('offset', function() {
      _t.navigate('records/search/start=50');
    });

    it('query and offset', function() {
      _t.navigate('records/search/query=test/start=50');
      expect(_t.vw.search.__ui.search).toHaveValue('test');
    });

  });


  it('#record/:id', function() {

    // --------------------------------------------------------------------
    // #records/:id should display a record edit form.
    // --------------------------------------------------------------------

    _t.navigate($(_t.getRecordRows()[0]).attr('href'));

    // Record form should be visible.
    expect(_t.el.editor).toContain(_t.el.record);

  });


  it('#record/add', function() {

    // --------------------------------------------------------------------
    // #records/add should display a record add form.
    // --------------------------------------------------------------------

    _t.navigate('records/add');

    // Record form should be visible.
    expect(_t.el.editor).toContain(_t.el.record);

  });


  it('#styles', function() {

    // --------------------------------------------------------------------
    // #styles should display the style editor.
    // --------------------------------------------------------------------

    _t.navigate('styles');

    // Style editor should be visible.
    expect(_t.el.editor).toContain(_t.el.menu);
    expect(_t.el.editor).toContain(_t.el.styles);

    // "Styles" tab should be active.
    expect(_t.vw.menu.__ui.tabs.styles).toHaveClass('active');

  });


});
