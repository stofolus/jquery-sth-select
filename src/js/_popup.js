"use strict";

(function(){

	function SthSelectPopup(properties){

		var self = this;
		var _$popup = null;
		var _$title = null;
		var _$titleText = null;
		var _$titleClose = null;
		var _$content = null;
		var _$filter = null;
		var _$overlay = null;
		var _properties = properties;
		var _onSelectCallback = null;
		var _qntityOfItems = 0;
		var _items = [];
		var _filteredItems = [];

		/**
		 * Max of height (in pixels) that the popup can
		 * assume when open.
		 */
		var MAX_HEIGHT = 500;

		/**
		 * Constructor.
		 * Creates the popup section element in the DOM.
		 *
		 * The section is created only once. Several calls
		 * does not have effect.
		 */
		(function create(){

			if( isAlreadyInDOM() ){
				_$popup = $(".sth-select-popup");
				_$title = $(".sth-select-title");
				_$titleText = $(".sth-select-title-text");
				_$titleClose = $(".sth-select-title-close");
				_$content = $(".sth-select-content");
				_$filter = $(".sth-select-filter");
				_$overlay = $(".sth-overlay");
			} else {
				_$popup = $('<section class="sth-select-popup"></section>');
				_$title = $('<div class="sth-select-title"></div>');
				_$titleText = $('<span class="sth-select-title-text"></span>');
				_$titleClose = $('<span class="sth-select-title-close">X</span>');
				_$content = $('<div class="sth-select-content"></div>');
				_$filter = $('<input class="sth-select-filter"/>');
				_$overlay = (new window.SthOverlay());

				_$title
					.append(_$titleText)
					.append(_$titleClose);

				_$popup
					.append(_$title)
					.append(_$filter)
					.append(_$content)
					.appendTo( $("body") );
			}

			_$titleClose.click( e => {
				hide();
			});

			_$filter.keydown(e => {
				setTimeout(_ => {
					_renderList();
				}, 0);
			});

			_items = properties.items;
			_filteredItems = _items;
			_qntityOfItems = _items.length;
		})();

		/**
		 * Checks if the popup is already inserted in DOM.
		 * It prevents many insertions and performance loss.
		 */
		function isAlreadyInDOM(){
			let $alreadyExistent = $(".sth-select-popup");
			return ( $alreadyExistent && $alreadyExistent.length > 0 );
		}

		/**
		 * Shows the popup on the screen.
		 */
		function show(){
			_$overlay.show();

			if( ! _properties.hasFilter )
				_$filter.val("");

			_$titleText.text(_properties.title);
			_controlFilterVisibility();
			_renderList();

			let height = _calculatePopupHeight();
			_$popup.animate({height: height}, 500);
		}

		/**
		 * Calculates pop-up's height based on
		 * number of added items.
		 */
		function _calculatePopupHeight(){
			let singleItemHeight = _$content
				.find(".sth-select-item")
				.first()
				.outerHeight();

			let qntityOfItems = _qntityOfItems;
			let allItemsHeight = (singleItemHeight * qntityOfItems);
			let titleHeight = _$title.outerHeight();

			let contentHeight = (allItemsHeight + titleHeight);
			return contentHeight < MAX_HEIGHT ? contentHeight : MAX_HEIGHT;
		}

		/**
		 * Hides the popup on the screen.
		 */
		function hide(){
			_$overlay.hide();
			_$popup.animate({height: 0}, 500);
		}

		/**
		 * Add an item.
		 */
		function _addItem(item, autoRender){
			autoRender = autoRender || true;

			let text = item.text;
			let $listItem = $('<div class="sth-select-item">' + text + '</div>');
			$listItem.data('item', item);

			if( autoRender )
				_$content.append( $listItem );

			return $listItem;
		}

		/**
		 * Renders all elements in the list of options.
		 */
		function _renderList(){
			_clear();

			let rerenderOnEachItem = false;
			let $listItems = $([]);
			let textFilter = _$filter.val().toLowerCase();

			_items.map( item => {
				if(item.text.toLowerCase().indexOf(textFilter) != -1){
					let $listItem = _addItem(item, rerenderOnEachItem);
					$listItems = $listItems.add( $listItem );
				}
			});

			_$content.append( $listItems );
			_$content.one('click', function(event) {
				_onSelectCallback( $(event.target).data('item') );
				hide();
			});
			let popupHeight = _calculatePopupHeight();
			let titleHeight = _$title.outerHeight();
			_$content.outerHeight( (popupHeight - titleHeight) );
		}

		/**
		 * Clear (removes from DOM) all elements on the list.
		 */
		function _clear(){
			_$content.empty();
		}

		/**
		 * Event handler which calls a callback when an item
		 * is selected.
		 */
		function onSelect(callback){
			_onSelectCallback = callback;
		}

		/**
		 * Sets the filter field visibility based on
		 * hasFilter property.
		 */
		function _controlFilterVisibility(){
			let visibility = _properties.hasFilter ? "block" : "none";
			_$filter.css("display", visibility);
			_$filter.attr("placeholder", _properties.filterPlaceholder);
		}

		/**
		 * Public available methods.
		 */
		return {
			show: show,
			hide: hide,
			onSelect: onSelect
		};
	}

	window.SthSelect = window.SthSelect || {};
	window.SthSelect.SthSelectPopup = SthSelectPopup;
})();
