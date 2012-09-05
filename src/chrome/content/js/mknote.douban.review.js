//@huntbao @mknote
//All right reserved
;(function($){
    $.extend(MKNoteWebclipper, {
	getPageReiveDouban: function(){
	    var self = this,
	    title = content.document.querySelector('span[property="v:summary"]'),
	    reviewDate = content.document.querySelector('span[property="v:dtreviewed"]'),
	    reviewDescription = content.document.querySelector('span[property="v:description"]'),
	    reviewer = content.document.querySelector('span[property="v:reviewer"]'),
	    itemReviewed = content.document.querySelector('span[property="v:itemreviewed"]'),
	    tag = '豆瓣评论';
	    title = '《' + itemReviewed.textContent + '》 的评论：' + title.textContent;
	    sourceurl =  content.location.href;
	    noteContent = reviewDate.textContent 
		+ '&nbsp;&nbsp;&nbsp;&nbsp;来自：' 
		+ reviewer.parentNode.outerHTML 
		+ '<br /><br /><p>' + reviewDescription.innerHTML + '</p>';
	    self.Note.saveNote(title, sourceurl, noteContent, tag);
	}
    });
})(MKNoteWebclipper.jQuery);
//douban's html structrue is very good for analysis 