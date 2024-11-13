var ReviewQuesions = function(){
	var reviewDiv;
	//var oData = Const.examData;
	var oData = Const.currentQuestionsSet;
	var mcqSet = new Array();
	var reviewTablebody
	function createReview() {
		reviewDiv = $('<div>', {class: 'reviewDiv'});
		//reviewHTML = $('');
		
		
		var reviewTablehead = $('<table class="review-tbl"><tr><th class="reviewTableheadth1 tabindex" aria-label="Question">Question</th><th class="reviewTableheadth2 tabindex" aria-label="Question">Your Response</th><th class="reviewTableheadth3 tabindex">Rationale<span class="close_review_ques tabindex" aria-label="close">X</span></th></tr></table>');
		reviewTablebody = $('<div class="review-tbl-body tabindex"></div>');
		$(reviewDiv).append(reviewTablehead);
		
		console.log("User answers array>",Const.currectUserAnswers);
		for(var i=0;i<oData.length;i++) { 
			try{
				console.log("@activityType",oData[i]['@activityType']);
				if(oData[i]['@activityType']=='MCQ'){
					var oMCQ = new MCQViewOnly(oData[i],Const.blockStart+i,Const.blockEnd)
				}else if(oData[i]['@activityType']=='MCMS'){
					var oMCQ = new MCMSViewOnly(oData[i],Const.blockStart+i,Const.blockEnd)
				}else{
					var oMCQ = new MCQTableViewOnly(oData[i],Const.blockStart+i,Const.blockEnd)
				}

				console.log("oData[i]> ",oData[i])

				oMCQ.setFinalState(Const.currectUserAnswers[i])
				var result 
				if(Const.currectUserAnswers[i] == undefined)
				{
					result = "Not Answered";
				}
				else
				{
					result = Const.currectUserAnswers[i].type;
				}
				var newTR = $('<div>', {class:'breakdiv'});
				var firstTD = $('<div>', {class:'reviewquestion_div tabindex'});
				firstTD.append(oMCQ.getHTML());
				var secondTD = $('<div>', {class:'reviewanswer_div tabindex'});
				secondTD.append(result);

				var thirdTD = $('<div>', {class:'reviewrationale_div tabindex'});
				thirdTD.append(oData[i].rationale);


				var copyRight_text = $('<div class="divFooterPrint">Copyright © 2018, Elsevier Inc. All Rights Reserved</div>');
				newTR.append(firstTD)
				newTR.append(secondTD)
				newTR.append(thirdTD)
				// newTR.append(copyRight_text);

				reviewTablebody.append(newTR);
				/*if(i == oData.length-1){
					var firstTD = $('<div>', {class:'questiontd questiontdht'});
					newTR.append(firstTD);
					reviewTablebody.append(newTR);
				}*/
			}
			catch(err){
				console.log("Error:" + err)
			}
			
		}
		$(reviewDiv).append(reviewTablebody);
		
		mcqSet.push(oMCQ);
	}
	
	createReview();
	return{
		getHTML:function() {
			return reviewDiv;
		}
	}

}