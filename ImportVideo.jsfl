
var tmpXmlFile = fl.configURI + "/tmp.xml";
fl.trace(tmpXmlFile);
var lib = fl.getDocumentDOM().library;
var docPath = fl.browseForFileURL("open", "Select FLA to import from");
var libMCPath = "";
var origDom = fl.getDocumentDOM();
var flDom = fl.openDocument(docPath);
var allItems = flDom.library.items;
var mcItems = [];
var n = allItems.length;
//var xPanel = <layout />;
for(var i=0; i < n; i++)
{
	var item = allItems[i];
	if(item.itemType == "movie clip")
	{
		mcItems.push(item);
	}
}

libMCPath = openDialog(mcItems, origDom.name);

if(libMCPath != "")
{
	fl.closeDocument(flDom);
	var mcName = prompt("Enter a name for the MC in library", "Video");
	importAsset(mcName, docPath, libMCPath);
}

function importAsset(mcName, flaDocPath, flaDocMCPath)
{
	lib.addNewItem('movie clip', mcName);
	if (lib.getItemProperty('linkageImportForRS') == true) 
	{
		lib.setItemProperty('linkageImportForRS', false);
	}else 
	{
		lib.setItemProperty('linkageExportForAS', false);
		lib.setItemProperty('linkageExportForRS', false);
	}
	lib.setItemProperty('sourceFilePath', flaDocPath);
	lib.setItemProperty('sourceLibraryName', flaDocMCPath);
	lib.setItemProperty('sourceAutoUpdate',false);
	
	origDom.getTimeline().addNewLayer(mcName);
	origDom.library.selectItem(mcName);
	origDom.library.addItemToDocument({x:0, y:0});
	origDom.align('bottom', true);
	origDom.align('right', true);
}

function openDialog(mcItems, docOpen)
{
	var xmlGui = buildXulGui(mcItems, docOpen);
  	FLfile.write(tmpXmlFile, xmlGui);

  	settings = fl.getDocumentDOM().xmlPanel(tmpXmlFile);
	
	var path = "";
	if(settings.dismiss == 'accept')
	{
		//
		//batchExport(settings.folder, settings.checkStr, settings.sub);
		path = settings.movieclipList;
	 }
	 else
	  {
		
	  }
	  return path;
}

function buildXulGui(mcItems, docOpen)
{	
	var output = "";
	output += '<dialog id="dialog" title="Select MC to reference" buttons="accept, cancel">';
	output += '<script>';
		output += 'function okClick(){fl.xmlui.accept();}';
		output += 'function cancelClick(){fl.xmlui.cancel();}';
	output += '</script>';
	output += '<vbox>';
		output += '<label width="300" value="Importing into: ' + docOpen + '"/>';
		output += '<label width="300" value="Select the movieclip from library to use as the video source"/>';
		output += '<separator/>';
		output += '<menulist id="movieclipList">';
			var n = mcItems.length;
			for(var i=0; i< n; i++)
			{
				output += '<menuitem label="' + mcItems[i].name + '" value="' + mcItems[i].name + '" />'; 
			}
		output += '</menulist>';
	output += '</vbox>';
	output += '</dialog>';
 return output;
}
