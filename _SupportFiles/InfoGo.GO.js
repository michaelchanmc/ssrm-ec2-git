/* Checkbox Scripting on Info Home Page */
function AddToArray(ele) {
	if (ele)
		rdSelectBookmark(ele.value, ele.checked);
	
	var cnt = rdGetSelectedBookmarks().length;
	var DelBtn = document.getElementById('btnDeleteBatch_Row1');
	var BtnCnt = document.getElementById('btnArrayCnt_Row1');
	var BtnMove = document.getElementById('btnMoveBatch_Row1');
	var AllChk = document.getElementById('bmCheckAll_Row1');
	var sFolders = document.getElementById('rdSelectedFolderID');
	var FolderSelect = sFolders.value;
	
	AllChk.checked = false;
	
	if(FolderSelect == 'sharedFolder' && DelBtn)
		DelBtn.style.display = 'none';
 
	if(cnt >= 1) {
		if (BtnCnt.style.display != 'inline') {
			BtnCnt.style.display = 'inline';
			BtnMove.style.display = 'inline';
			
			if (DelBtn && FolderSelect != 'sharedFolder')
				DelBtn.style.display = 'inline';
			
			ClearBatchAllRows(true);
		}
		
		BtnCnt.innerHTML = ' (' + cnt + ')';
	}
	else if (BtnCnt.style.display != 'none') {
		if (DelBtn)
			DelBtn.style.display = 'none';
		
		BtnCnt.style.display = 'none';
		BtnMove.style.display = 'none';
		
		ClearBatchAllRows(false);
	}
	
	if (ele)
		HideShowRowElements(ele);
}

function HideShowRowElements(ele)
{
	var chkBox = ele;
	var r = chkBox.id.split("_");
	var rowSuffix = r[1];
	var n = chkBox.checked;

	//Add Bold Title
	var bTitle = document.getElementById('divGoListItemTitle_' + rowSuffix);

	if(bTitle)
	{
		if(n)
		{
			bTitle.classList.add("go-bold");
		}
		else
		{
			bTitle.classList.remove("go-bold");
		}
	}
}

function ClearBatchAllRows(bHide)
{
	var getRow = document.getElementsByClassName('go-list-item');
    for (var i = 0; i < getRow.length; i++) {
		var rowSuffix = 'Row' + (i+1);

		var newImg = document.createElement('img');
		newImg.src = 'rdTemplate/rdBookmarkOrganizer/rdBookmarkSharingTransparent.png';
		newImg.id = 'colBatchIcon_' + rowSuffix;
		newImg.width = '24';
		newImg.height = '24';

       //Hide Row Buttons
		var sched = document.getElementById('colSchedule_' + rowSuffix);
		if (sched)
			sched = sched.firstElementChild;
		
		var share = document.getElementById('colShare_' + rowSuffix);
		if (share)
			share = share.firstElementChild;
		
		var del = document.getElementById('colDelete_' + rowSuffix);
		if (del)
			del = del.firstElementChild;
		
		var drag = document.getElementById('colDrag_' + rowSuffix);
		if (drag)
			drag = drag.firstElementChild;
			
		var bdragAdd = document.getElementById('colDrag_' + rowSuffix);
		var bdragRem = document.getElementById('colBatchIcon_' + rowSuffix);
		
		if(bHide)
		{
			(sched)?sched.style.display = 'none': false;
			(share)?share.style.display = 'none': false;
			(del)?del.style.display = 'none': false;
			(drag)?drag.style.display = 'none': false;
			bdragAdd.appendChild(newImg);
		}
		else
		{
			//Check Shared Item
			if(share && share.className != "ThemeHidden")
				share.style.display = 'table-cell';
			
			(del)?del.style.display = 'table-cell': false;
			(sched)?sched.style.display = 'table-cell': false;
			
			drag.style.display = 'table-cell';
			if(bdragRem)
			{
				bdragRem.parentNode.removeChild(bdragRem);
			}
		}
	}
}

function goBookmarkSelectionCleared() {
	AddToArray(null);
}

function CheckAllBookmarks(ele)
{
	var sFolders = document.getElementById('rdSelectedFolderID');
	var AllChk = document.getElementById('bmCheckAll_Row1');
	var FolderSelect = sFolders.value;
	  
	if(FolderSelect == 'sharedFolder')
	{
		console.log(FolderSelect, AllChk);
		(AllChk)?AllChk.style.display = 'none':false;
		return false;
	}
	
	var isChecked = ele.checked;
	var getElem = document.getElementsByClassName('bkSelectElem');
    for (var i = 0; i < getElem.length; i++) {
		if(isChecked)
		{
			if(!getElem[i].checked)
			{
				getElem[i].click();
			}
		}
		else
		{
			if(getElem[i].checked)
			{
				getElem[i].click();
			}
		}
	}
	if(isChecked)
	{
		ele.checked = true;
	}
}

function UnCheckAllBookmarks()
{
	var getElem = document.getElementsByClassName('bkSelectElem');
    for (var i = 0; i < getElem.length; i++) {
		if(getElem[i].checked)
		{
			getElem[i].click();
		}
    }
}

document.addEventListener("DOMContentLoaded", function () {
	if (!Y)
		return;
	
	var bo = Y.one("#BookmarkOrganizer");
	if (bo)
		bo.on("selectioncleared", goBookmarkSelectionCleared);
});
