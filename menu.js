$(function() {
  $('#visuals-menu').menu({
    select: function(event, ui) {
      gallery.selectVisual(ui.item.attr('value'));
    }});
});
