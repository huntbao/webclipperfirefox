//@huntbao @mknote
//All right reserved
;(function($){
    $.extend(MKNoteWebclipper, {
	getLinkInfoByUrlWeibo: function(link){
	    var self = this;
	    if(link.getAttribute('date')){
		//date url, ok
		var contentContainer = $(link).parent().parent(),
		noteContent = '',
		contentEl,
		forwardStr = '<br /><br /><em style="font-weight:bold;">【转发的微博】</em><br /><br />';
		if(contentContainer.is('.content')){
		    contentEl = contentContainer.find('p[node-type="feed_list_content"]');
		    noteContent += contentEl.text().trim();
		    //maybe has forward weibo, add it
		    var comment = contentContainer.find('.comment');
		    if(comment.length > 0 && comment.children().length > 1){
			//include forward data
			var commentNode = comment.find('dt[node-type="feed_list_forwardContent"]');
			noteContent += forwardStr;
			noteContent += commentNode.text().trim() + '<br /><br />';
		    }
		    let img = contentEl.parent().find('img.bigcursor'),
		    title = contentEl.text().trim(),
		    tag = '新浪微博',
		    sourceurl = link.href;
		    self.saveWeiBoNote(img, title, sourceurl, noteContent, tag);
		}else if(contentContainer.is('.WB_func')){
		    contentContainer = contentContainer.parent();
		    //new version weibo - 120905
		    var infos = contentContainer.find('.WB_info'),
		    texts = contentContainer.find('.WB_text'),
		    //微博首页
		    img = contentContainer.find('img[node-type = "feed_list_media_bgimg"]');
		    if(img.length == 0){
			//点击时间链接后的该条微博的详情页面
			img = contentContainer.find('img[action-type = "feed_list_media_bigimg"]');
		    }
		    let title = texts.eq(0).text().trim(),
		    tag = '新浪微博',
		    sourceurl = link.href;
		    
		    if(texts.length == 1){
			if(infos.length == 1){
			    noteContent += infos.text().trim() + '：';
			    noteContent += title;
			    title = infos.text().trim() + '：' + title;
			}else if(infos.length == 0){
			    noteContent += title;
			}
		    }else if(texts.length == 2){
			//noteContent += infos.text().trim() + '：';
			if(infos.length == 1){
			    noteContent += title + '：';
			    noteContent += forwardStr;
			    noteContent += infos.text().trim() + '：';
			    noteContent += texts.eq(1).text().trim() + '：';
			}else if(infos.length == 2){
			    noteContent += infos.eq(0).text().trim() + '：';
			    noteContent += title + '：';
			    noteContent += forwardStr;
			    noteContent += infos.eq(1).text().trim() + '：';
			    noteContent += texts.eq(1).text().trim() + '：';
			    title = infos.eq(0).text().trim() + '：' + title;
			}
		    }
		    noteContent += '<br /><br />';
		    self.saveWeiBoNote(img, title, sourceurl, noteContent, tag);
		}
	    }else{
		self.Notification.show(self.i18n.getMessage('NotValideWeiboLink'));
	    }
	},
	saveWeiBoNote: function(img, title, sourceurl, noteContent, tag){
	    var self = this;
	    if(img.length > 0){
		self.Notification.show(self.i18n.getMessage('DownLoadWeiboImg'), false);
		let largeImg = new Image();
		largeImg.onload = function(){
		    self.Note.saveImgs({
			imgs: [largeImg],
			title: title,
			imgTitles: [''],
			tags: tag,
			sourceurl: sourceurl
		    }, function(data, serializeSucceedImgIndexByOrder, noteId){
			noteContent += '<br /><img src="' + data[0].ExternalUrl.escapeHTML() + '">';
			self.Note.saveNote(title, sourceurl, noteContent, tag, '', noteId);
		    }, function(){
			noteContent += '<br /><img src="' + img.src.escapeHTML() + '">';
			self.Note.saveNote(title, sourceurl, noteContent, tag);
		    });
		}
		largeImg.src = img[0].src.escapeHTML().replace(/thumbnail/, 'large').replace(/bmiddle/, 'large');
	    }else{
		self.Note.saveNote(title, sourceurl, noteContent, tag);
	    }
	}
    });
})(MKNoteWebclipper.jQuery);