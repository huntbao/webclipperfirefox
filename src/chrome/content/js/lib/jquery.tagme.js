/*
jQuery Tag Me v1.0.0
Copyright (C) 2012- Hunt Bao
Hunt Bao - gzooler@gmail.com

https://github.com/huntbao/tagme

Inspired by jQuery Tag Handler: http://ioncache.github.com/Tag-Handler/

------------------------------------------------------------------------------------------
Description 
------------------------------------------------------------------------------------------
    
Tag Me is a jQuery plugin used for managing tag-type metadata.

------------------------------------------------------------------------------------------
Basic Usage HTML Structure
------------------------------------------------------------------------------------------

Css file: <link rel="stylesheet" href="jquery.tagme.css" />

JS  file: <script src="jquery.tagme.js"></script>

HTML structure, only a <ul> element is needed, like: 
<ul class="yourtagmewrap" id="yourtagmewrap"></ul>

------------------------------------------------------------------------------------------
Basic Usage Instructions
------------------------------------------------------------------------------------------
    
* Click on the tag input, type some words, hit enter or comma 
  or the character your specified via options to add a tag.
    
* Hitting backspace inside the tag input or clicking on the tag to remove a tag.
    
------------------------------------------------------------------------------------------
Plugin Options
------------------------------------------------------------------------------------------
    
Tag data specific options:
--------------------------
    
Option                 Description                                          Default Value
-------------------    ---------------------------------------------------  --------------
readOnly               tags can edit or not                                 false
addKey                 character pressed to add a tagName                   '，'
availableTags          only tags in this array can be used,                 
                       'true' means any tag can be used                     true
charsLength            tag's length must match this pattern                 
                       '0-0' means any length is allowed                    '0-0'
maxTags                max number of tags. 0 means no constraints           0
autocomplete           autocomplete function, depends on jQuery UI          false
autocompleteTagsList   autocomplete tags list                               []
autocompleteMinChars   autocomplete minimun characters                       0
inputPlaceHolder       tag input placeholder                                '回车确认添加'

Callback options:
-------------------------
Option                Description                                            Default Value
--------------        ----------------------------------------------------   --------------
onAdd                 function to be called when a new tag is added          not specified
afterAdd              function to be called after a new tag is added         not specified
onDelete              function to be called when a tag is deleted            not specified
afterDelete           function to be called after a tag is deleted           not specified
onExist               function to be called when a tag exist                 not specified
onUnAvailable         function to be called when a tag unavailable           not specified
onMaxTag              function to be called when max tags number reached     not specified
onErrorCharsLength    function to be called when tag's length is wrong       not specified
onMouseenter          function to be called when mouse enter tag container   not specified
onMouseleave          function to be called when mouse leave tag container   not specified

Methods
------------------------
    
Name               Description                                  Usage
-----------------  -------------------------------------------  ---------------------------
getTags            returns an array of tags                     .tagme('getTags')
getSerializedTags  returns comma separated string of tags       .tagme('getSerializedTags')
setTags            set an array of tags                         .tagme('setTags',['a'],true)
clearTags          clear all tags                               .tagme('clearTags')
destroy            destroy tag container                        .tagme('destroy')
version            get tagme's version                          .tagme('version')
    
-------------------------------------------------------------------------------------------
License
-------------------------------------------------------------------------------------------
    
This program is free software: you can redistribute it and/or modify
it under the terms of the Lesser GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
    
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
Lesser GNU General Public License for more details.
    
You should have received a copy of the Lesser GNU General Public License
along with this program.  If not, see < http://www.gnu.org/licenses/ >.

*/
(function($, undefined){
    $.fn.tagme = function(options){
        if(typeof options === 'object' || options === undefined){
            options = $.extend({}, $.fn.tagme.defaultOptions, options);
            return this.each(function(){
                var t = this,
                tagUL = $(t);
                if(!tagUL.is('ul')) return true;
                tagUL.addClass('tagme-container');
                var tagInput = null;
                tagUL.data('existtags', []).data('options', options);
                addInitTags(tagUL);
                if(!options.readOnly){
                    var checkAddTagValue = function(value){
                        var checkTagResult = addTagCheck(value, tagUL),
                        opt = tagUL.data('options');
                        if(checkTagResult === true){
                            //can add
                            var onAddResult = true;
                            if($.isFunction(opt.onAdd)){
                                onAddResult = opt.onAdd.call(this, value);
                            }
                            if(onAddResult){
                                addNewTag(tagInput, value, tagUL);
                            }
                            if($.isFunction(opt.afterAdd)){
                                opt.afterAdd.call(this, value);
                            }
                        }
                    },
                    checkRemoveTag = function(tag){
                        var onDeleteResult = true,
                        opt = tagUL.data('options');
                        if($.isFunction(opt.onDelete)){
                            onDeleteResult = onDeleteResult = opt.onDelete.call(this, tag.text());
                        }
                        if(onDeleteResult){
                            removeTag(tag, tagUL, tagInput);
                        }
                        if($.isFunction(opt.afterDelete)){
                            opt.afterDelete.call(this, tag.text());
                        }
                    }
                    tagInput = $('<input>', {class: 'tagme-input', placeholder: options.inputPlaceHolder}).keydown(function(e){
                        var code = e.which,
                        ti = $(this),
                        opt = tagUL.data('options');
                        if(code === 13 || code === 188 || code === opt.addKey.charCodeAt(0)){
                            checkAddTagValue($.trim(ti.val()));
                        }else if(code === 8 && ti.val() === ''){
                            checkRemoveTag(ti.parent().prev());
                        }
                    });
                    tagUL.append($('<li>', {class: 'tagme-inputwrap'}).append(tagInput));
                    if(options.autocomplete && $.isFunction($.fn.autocomplete)){
                        options.autocompleteTagsList = mergeArrayUnique(options.autocompleteTagsList, options.initTags).sort();
                        tagInput.autocomplete({
                            source: options.autocompleteTagsList,
                            select: function(event, ui){
                                if(event.which === 13) return false;
                                checkAddTagValue($.trim(ui.item.value));
                                return false;
                            },
                            minLength: options.autocompleteMinChars
                        }).focus(function (){
                            if($(this).val() === ''){
                                $(this).autocomplete('search', '');
                            }
                        });
                    }
                    tagUL.delegate('.tagme-item', 'click', function(e){
                        checkRemoveTag($(this));
                    }).click(function(e){
                        tagInput && tagInput.focus();
                    }).mouseenter(function(){
                        var opt = tagUL.data('options');
                        if($.isFunction(opt.onMouseenter)){
                            opt.onMouseenter.call(this);
                        }
                    }).mouseleave(function(){
                        var opt = tagUL.data('options');
                        if($.isFunction(opt.onMouseleave)){
                            opt.onMouseleave.call(this);
                        }
                    });
                }
                return true;
            });
        }else if(typeof options === 'string' && publicMethod[options]) {
            return publicMethod[options].call(this, Array.prototype.slice.call(arguments, 1));
        }
        return true;
    }
    $.fn.tagme.defaultOptions = {
        readOnly: false,
        addKey: '，',
        initTags: [],
        availableTags: true,
        charsLength: '0-0',
        maxTags: 0,
        autocomplete: false,
        autocompleteTagsList: [],
        autocompleteMinChars: 0,
        inputPlaceHolder: '回车确认添加'
        //onDelete: function(){},
        //afterDelete: function(){},
        //onAdd: function(){},
        //afterAdd: function(){},
        //onExist: function(){},
        //onUnAvailable: function(){},
        //onMaxTag: function(){},
        //onErrorCharsLength: function(){},
        //onMouseenter: function(){},
        //onMouseleave: function(){}
    }
    //publicMethods
    var publicMethod = {
        getSerializedTags: function(){
            var currentTags = [];
            $(this).find('li.tagme-item').each(function(idx, e){
                currentTags.push($(e).text());
            });
            return currentTags.join(',');
        },
        getTags: function(){
            var currentTags = [];
            $(this).find('li.tagme-item').each(function(idx, e){
                currentTags.push($(e).text());
            });
            return currentTags;
        },
        setTags: function(){
            if(arguments[0][1] === true){
                //clear exist tags
                $(this).data('existtags', []).find('li.tagme-item').remove();
            }
            addTags($(this), arguments[0][0]);
            return $(this);
        },
        clearTags: function(){
            $(this).data('existtags', []).find('li.tagme-item').remove();
            return $(this);
        },
        destroy: function(){
            return $(this).empty().unbind();
        },
        version: function(){
            return '1.0.0';
        }
    }
    if(typeof Array.prototype.indexOf !== 'function'){
        Array.prototype.indexOf = function(elem, fromIndex){
            fromIndex = fromIndex || 0;
            for (var i = fromIndex, len = this.length; i < len; i++) {
                if (this[i] === elem) {
                    return i;
                }
            }
            return -1;
        }
    }
    if(typeof Array.prototype.remove != 'function'){
        Array.prototype.remove = function(elem){
            var i = this.indexOf(elem);
            if (i !== -1) {
                this.splice(i, 1);
                return true;
            }
            else {
                return false;
            }
        }
    }
    if(typeof Array.prototype.unique != 'function'){
        Array.prototype.unique = function(){
            var a = this.concat();
            for(var i = 0; i < a.length; ++i){
                for(var j = i + 1; j < a.length; ++j){
                    if(a[i] === a[j]){
                        a.splice(j, 1);
                    }
                }
            }
            return a;
        }
    }
    function mergeArrayUnique(arr1, arr2){
        return arr1.concat(arr2).unique();
    }
    function checkLength(options, tagValue){
        if(options.charsLength !== '0-0'){
            var chars = options.charsLength.split('-'),
            minChars = parseInt(chars[0]),
            maxChars = parseInt(chars[1]);
            if(minChars <= maxChars){
                if(minChars !== 0 && tagValue.length < minChars || maxChars !== 0 && tagValue.length > maxChars){
                    //chars length unmatch
                    if($.isFunction(options.onErrorCharsLength)){
                        options.onErrorCharsLength.call(this, tagValue);
                    }
                    return false;
                }
            }
        }
        return true;
    }
    function checkMaxTags(options, existTags){
        if(options.maxTags === 0){
            return true;
        }
        if(options.maxTags > existTags.length){
            return true;
        }
        //max tag number reached
        if($.isFunction(options.onMaxTag)){
            options.onMaxTag.call(this, existTags.length);
        }
        return false;
    }
    function checkExistTag(options, newTagValue, existTags){
        var exist = existTags.indexOf(newTagValue);
        if(exist !== -1){
            //tag exist
            if($.isFunction(options.onExist)){
                options.onExist.call(this, newTagValue);
            }
            return true;
        }
        return false;
    }
    function checkAvailableTag(options, newTagValue){
        if(newTagValue === ''){
            //tag available
            if($.isFunction(options.onUnAvailable)){
                options.onUnAvailable.call(this, newTagValue);
            }
            return false;
        }
        if(options.availableTags === true){
            return true;
        }
        var available = options.availableTags.indexOf(newTagValue);
        if(available === -1){
            //tag available
            if($.isFunction(options.onUnAvailable)){
                options.onUnAvailable.call(this, newTagValue);
            }
            return false;
        }
        return true;
    }
    function addTags(tagUL, tagsArr){
        if(!$.isArray(tagsArr)) return;
        var existTags = tagUL.data('existtags'),
        options = tagUL.data('options');
        $.each(tagsArr, function(idx, tagValue){
            if(addTagCheck(tagValue, tagUL)){
                tagUL.append($('<li>', {class: 'tagme-item', text: tagValue}));
                existTags.push(tagValue);
            }
        });
        var tagInput = tagUL.find('.tagme-inputwrap');
        if(tagInput.length > 0){
            tagUL.append(tagInput);//move taginput to last
        }
        tagUL.data('existtags', existTags);
    }
    function addInitTags(tagUL){
        addTags(tagUL, tagUL.data('options').initTags);
    }
    function addNewTag(tagInput, tagValue, tagUL){
        $('<li>', {class: 'tagme-item', text: tagValue}).insertBefore(tagInput.val('').parent());
        var existTags = tagUL.data('existtags'),
        options = tagUL.data('options');
        existTags.push(tagValue);
        tagUL.data('existtags', existTags);
        if(options.autocomplete && $.isFunction($.fn.autocomplete)){
            if(options.autocompleteTagsList.indexOf(tagValue) === -1){
                options.autocompleteTagsList.push(tagValue);
                tagInput.autocomplete('option', 'source', options.autocompleteTagsList.sort());
            }
        }
        tagInput.focus();
    }
    function removeTag(tagEl, tagUL, tagInput){
        var existTags = tagUL.data('existtags');
        if(tagEl.length > 0){
            tagEl.remove();
            existTags.remove($.trim(tagEl.text()));
            tagInput.focus();
            tagUL.data('existtags', existTags);
        }
    }
    function addTagCheck(newTagValue, tagUL){
        var existTags = tagUL.data('existtags'),
        options = tagUL.data('options');
        if(checkMaxTags(options, existTags) === false){
            return true;
        }
        if(checkLength(options, newTagValue) === false){
            return true;
        }
        var available = checkAvailableTag(options, newTagValue);
        if(available){
            var exist = checkExistTag(options, newTagValue, existTags);
            return exist ? false : true;
        }else{
            return false;
        }
        return true;
    }
})(jQuery);
