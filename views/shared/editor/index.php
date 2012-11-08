<?php
/**
 * The top-level Neatline editor view. Wraps the markup for the editing
 * interface and then calls the central _neatline.php partial, which is
 * shared with public views.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */
?>

<?php echo $this->partial('editor/_editor_header.php', array(
    'exhibit' => $exhibit,
    'title' => __('Neatline Editor: %s', $exhibit->title)
)); ?>

<!-- The item browser. -->
<?php echo $this->partial('editor/_item_browser.php'); ?>

<!-- The core Neatline partial. -->
<?php echo $this->partial('neatline/_neatline.php', array(
    'exhibit' => $exhibit
)); ?>

<!-- Custom footer. -->
<?php echo $this->partial('editor/_editor_footer.php'); ?>
