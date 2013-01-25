
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record list paginator.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records Pagination', function() {


  beforeEach(function() {
    _t.loadEditor();
    __editor.perPage = 2;
  });


  it('should hide pagination when all records fit', function() {

    // --------------------------------------------------------------------
    // The paginators should not be displayed when the entire record list
    // can fit into a single screen.
    // --------------------------------------------------------------------

    __editor.perPage = 10;

    // Load 2 records.
    _t.navigate('records');
    _t.respondLast200(_t.json.records.p12);

    // Paginators should be hidden.
    expect(_t.el.records.find('.pagination')).toBeEmpty();

  });

  describe('|xx|xxxx', function() {

    it('with search query', function() {

      // ------------------------------------------------------------------
      // << (disabled, #records/search/query=X), >> (enabled, next page).
      // ------------------------------------------------------------------

      // Load records 1-2.
      _t.navigate('records/search/query=X/start=0');
      _t.respondLast200(_t.json.records.p12);

      // << disabled, >> enabled.
      _t.assertPaginationPrevDisabled();
      _t.assertPaginationNextEnabled();

      // << links to query page 1, >> to next page.
      _t.assertPaginationPrevRoute('#records/search/query=X');
      _t.assertPaginationNextRoute('#records/search/query=X/start=2');

    });

    it('without search query', function() {

      // ------------------------------------------------------------------
      // << (disabled, #records), >> (enabled, next page).
      // ------------------------------------------------------------------

      // Load records 1-2.
      _t.navigate('records/search/start=0');
      _t.respondLast200(_t.json.records.p12);

      // << disabled, >> enabled.
      _t.assertPaginationPrevDisabled();
      _t.assertPaginationNextEnabled();

      // << links to page 1, >> to next page.
      _t.assertPaginationPrevRoute('#records');
      _t.assertPaginationNextRoute('#records/search/start=2');

    });

  });

  // describe('x|xx|xxx', function() {

  //   it('with search query', function() {

  //     // ------------------------------------------------------------------
  //     // << (enabled, #records/search/query=X), >> (enabled, next page).
  //     // ------------------------------------------------------------------

  //     console.log('before');
  //     _t.navigate('records/search/query=X/start=1');
  //     _t.respondLast200(_t.json.records.p23);
  //     console.log('after');

  //     _t.assertPaginationPrevEnabled();
  //     _t.assertPaginationNextEnabled();

  //     _t.assertPaginationPrevRoute('#records/search/query=X');
  //     _t.assertPaginationNextRoute('#records/search/query=X/start=3');

  //   });

  //   it('without search query', function() {

  //     // ------------------------------------------------------------------
  //     // << (enabled, #records), >> (enabled, next page).
  //     // ------------------------------------------------------------------

  //     _t.navigate('records/search/start=1');
  //     _t.respondLast200(_t.json.records.p23);

  //     _t.assertPaginationPrevEnabled();
  //     _t.assertPaginationNextEnabled();

  //     _t.assertPaginationPrevRoute('#records');
  //     _t.assertPaginationNextRoute('#records/search/start=3');

  //   });

  // });

  describe('xx|xx|xx', function() {

    // --------------------------------------------------------------------
    // << (enabled, 1st page), >> (enabled, next page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load records 3-4.
      _t.navigate('records/search/query=X/start=2');
      _t.respondLast200(_t.json.records.p34);

      // << enabled, >> enabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      _t.assertPaginationPrevRoute('#records/search/query=X');
      _t.assertPaginationNextRoute('#records/search/query=X/start=4');

    });

    it('without search query', function() {

      // Load records 3-4.
      _t.navigate('records/search/start=2');
      _t.respondLast200(_t.json.records.p34);

      // << enabled, >> enabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      _t.assertPaginationPrevRoute('#records');
      _t.assertPaginationNextRoute('#records/search/start=4');

    });

  });

  describe('xxxx|xx|', function() {

    // --------------------------------------------------------------------
    // << (enabled, previous page), >> (disabled, current page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load records 5-6.
      _t.navigate('records/search/query=X/start=4');
      _t.respondLast200(_t.json.records.p56);

      // << enabled, >> disabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      _t.assertPaginationPrevRoute('#records/search/query=X/start=2');
      _t.assertPaginationNextRoute('#records/search/query=X/start=4');

    });

    it('without search query', function() {

      // Load records 5-6.
      _t.navigate('records/search/start=4');
      _t.respondLast200(_t.json.records.p56);

      // << enabled, >> disabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      _t.assertPaginationPrevRoute('#records/search/start=2');
      _t.assertPaginationNextRoute('#records/search/start=4');

    });

  });

  describe('xxxxx|x|', function() {

    // --------------------------------------------------------------------
    // << (enabled, previous page), >> (disabled, current page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load record 6.
      _t.navigate('records/search/query=X/start=5');
      _t.respondLast200(_t.json.records.p6);

      // << enabled, >> disabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      _t.assertPaginationPrevRoute('#records/search/query=X/start=3');
      _t.assertPaginationNextRoute('#records/search/query=X/start=5');

    });

    it('without search query', function() {

      // Load record 6.
      _t.navigate('records/search/start=5');
      _t.respondLast200(_t.json.records.p6);

      // << enabled, >> disabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextDisabled();

      // << links to previous page, >> links to next page.
      _t.assertPaginationPrevRoute('#records/search/start=3');
      _t.assertPaginationNextRoute('#records/search/start=5');

    });

  });


});
