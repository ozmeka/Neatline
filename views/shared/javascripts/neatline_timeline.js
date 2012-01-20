/*
 * Component widget that controls the timeline. Instantiated by the parent
 * Neatline widget.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

(function($, undefined) {

    $.widget('neatline.neatlinetimeline', {

        options: {

            // CSS constants.
            css: {
                tape_height: 8
            }

        },

        /*
         * - return void.
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
            this.popup =                    $('#timeline-popup');
            this.popupTitle =               this.popup.find('h3.title-text');
            this.popupContent =             this.popup.find('div.content');
            this.popupClose =               this.popup.find('a.close');

            // Tracker array for tape elements.
            this._idToTapeElements = {};

            // Start-up.
            this._instantiateSimile();

        },

        /*
         * Construct the timeline.
         *
         * - return void.
         */
        _instantiateSimile: function() {

            var self = this;

            // Instantiate the event source object.
            this.eventSource = new Timeline.DefaultEventSource();

            // Define band data.
            this.bandInfos = [

                Timeline.createBandInfo({
                    eventSource:    this.eventSource,
                    width:          "80%",
                    intervalUnit:   Timeline.DateTime.YEAR,
                    intervalPixels: 100,
                    zoomIndex:      10,
                    zoomSteps:      new Array(
                      {pixelsPerInterval: 280,  unit: Timeline.DateTime.HOUR},
                      {pixelsPerInterval: 140,  unit: Timeline.DateTime.HOUR},
                      {pixelsPerInterval:  70,  unit: Timeline.DateTime.HOUR},
                      {pixelsPerInterval:  35,  unit: Timeline.DateTime.HOUR},
                      {pixelsPerInterval: 400,  unit: Timeline.DateTime.DAY},
                      {pixelsPerInterval: 200,  unit: Timeline.DateTime.DAY},
                      {pixelsPerInterval: 100,  unit: Timeline.DateTime.DAY},
                      {pixelsPerInterval:  50,  unit: Timeline.DateTime.DAY},
                      {pixelsPerInterval: 400,  unit: Timeline.DateTime.MONTH},
                      {pixelsPerInterval: 200,  unit: Timeline.DateTime.MONTH},
                      {pixelsPerInterval: 100,  unit: Timeline.DateTime.MONTH},
                      {pixelsPerInterval:  50,  unit: Timeline.DateTime.MONTH},
                      {pixelsPerInterval: 400,  unit: Timeline.DateTime.YEAR},
                      {pixelsPerInterval: 200,  unit: Timeline.DateTime.YEAR},
                      {pixelsPerInterval: 100,  unit: Timeline.DateTime.YEAR},
                      {pixelsPerInterval:  50,  unit: Timeline.DateTime.YEAR},
                      {pixelsPerInterval: 400,  unit: Timeline.DateTime.DECADE},
                      {pixelsPerInterval: 200,  unit: Timeline.DateTime.DECADE},
                      {pixelsPerInterval: 100,  unit: Timeline.DateTime.DECADE},
                      {pixelsPerInterval:  50,  unit: Timeline.DateTime.DECADE},
                      {pixelsPerInterval: 400,  unit: Timeline.DateTime.CENTURY},
                      {pixelsPerInterval: 200,  unit: Timeline.DateTime.CENTURY},
                      {pixelsPerInterval: 100,  unit: Timeline.DateTime.CENTURY},
                      {pixelsPerInterval:  50,  unit: Timeline.DateTime.CENTURY}
                    )
                }),

                Timeline.createBandInfo({
                    overview:       true,
                    eventSource:    this.eventSource,
                    width:          "20%",
                    intervalUnit:   Timeline.DateTime.DECADE,
                    intervalPixels: 70
                })

            ];

            // Sync bands.
            this.bandInfos[1].syncWith = 0;
            this.bandInfos[1].highlight = true;

            // Instantiate and load JSON.
            var container = document.getElementById('timeline');
            this.timeline = Timeline.create(container, this.bandInfos);
            this.loadData();

            // Override the default click event callbacks.
            this._catchClickCallbacks();

            // Reposition on window resize.
            this._window.bind({

                'resize': function() {
                    self.timeline.layout();
                }

            });

        },

        /*
         * Listen for event clicks.
         *
         * - return void.
         */
        _catchClickCallbacks: function() {

            var self = this;

            // Whitewash over the default bubble popup event so as to get event id data.
            Timeline.OriginalEventPainter.prototype._showBubble = function(x, y, evt) {

                // Trigger out to the deployment code.
                self._trigger('eventclick', {}, {
                    'recordid': evt._eventID
                });

            }

        },

        /*
         * Fetch and render events.
         *
         * - return void.
         */
        loadData: function() {

            var self = this;

            // Ping the json server and get the events data.
            this.timeline.loadJSON(Neatline.dataSources.timeline, function(json, url) {

                // Render the events.
                self.eventSource.clear();
                self.eventSource.loadJSON(json, url);

            });

            // Set the starting date, if defined.
            if (Neatline.default_focus_date != null) {
                var startDate = Date.parse(Neatline.default_focus_date);
                this.timeline.getBand(0).setCenterVisibleDate(startDate);
            }

            // Apply the ambiguity gradients.
            var band0 = this.timeline.getBand(0);
            var painter0 = band0.getEventPainter();

            painter0.addEventPaintListener(function(band, op, evt, els) {

                if (els != null) {

                    // Get the tape element.
                    var tape = $(els[0]);

                    // Store the Simile positioning styles.
                    tape.data('positioningStyles', tape.attr('style'));

                    // Instantiate the span styler on the tape.
                    tape.spanstyler();

                    // Build CSS.
                    tape.spanstyler(
                        'constructCss',
                        evt._obj.color,
                        evt._obj.left_ambiguity,
                        evt._obj.right_ambiguity
                    );

                    // Manifest.
                    tape.spanstyler('applyCss');

                    // Push the id-element association into the tracker object.
                    self._idToTapeElements[evt._eventID] = [tape];

                }

            });

        },

        /*
         * Focus on the listing for the record with the passed id.
         *
         * - param integer id:      The id of the record.
         *
         * - return void.
         */
        zoomToEvent: function(id) {

            var self = this;

            $.each(this.timeline._bands[0]._eventSource._events._idToEvent, function(i, event) {

                if (event._eventID == id) {
                    self.timeline.getBand(0).setCenterVisibleDate(event._start);
                }

            });

        },

        /*
         * Get the current center date.
         *
         * - return string date             The center date:
         */
        getCenterForSave: function() {
            return this.timeline.getBand(0).getCenterVisibleDate().toString();
        },

        /*
         * Set the date ambiguity for the record with the passed id.
         *
         * - param integer id:              The id of the record.
         * - param string color:            The color to set.
         * - param integer leftPercent:     The left percentage threshold.
         * - param integer rightPercent:    The right percentage threshold.
         *
         * - return void.
         */
        setDateAmbiguity: function(id, color, leftPercent, rightPercent) {

            var self = this;

            if (typeof this._idToTapeElements[id] !== 'undefined') {

                $.each(this._idToTapeElements[id], function(i, el) {

                    // First, strip off the styles and reapply just the simile positioning.
                    el.attr('style', el.data('positioningStyles'));

                    // Apply the gradient style.
                    el.spanstyler('constructCss', color, leftPercent, rightPercent);
                    el.spanstyler('applyCss');

                });

            }

        },

        /*
         * Set the color for the record with the passed id.
         *
         * - param integer id:      The id of the record.
         * - param string color:    The color to set.
         *
         * - return void.
         */
        setDateColor: function(id, color) {

            var self = this;

            if (typeof this._idToTapeElements[id] !== 'undefined') {

                $.each(this._idToTapeElements[id], function(i, el) {

                    // First, strip off the styles and reapply just the simile positioning.
                    el.attr('style', el.data('positioningStyles'));

                    // Apply the gradient style.
                    el.spanstyler('constructCss', color, null, null);
                    el.spanstyler('applyCss');

                });

            }

        },

        /*
         * Rerender the timeline.
         */
        refresh: function() {
            this.timeline.layout()
        }

    });

})( jQuery );
