const docusign = require("docusign-esign");
const docs = require("./docs");
const fs = require('fs');

function makeEnvelope(args) {

  let env = new docusign.EnvelopeDefinition();
  env.emailSubject = "DocuSign REPLIT Example";
  
  // Responsive Option 1 = HTML sent via htmlDefinition
  let docAsHtml = createHtmlDefinitionDoc('1_AgreementNotExport.html');
  docAsHtml.documentId = "1"; 
  let docAsHtml2 = createHtmlDefinitionDoc('2_91581_DCAP_CO.html');
  docAsHtml2.documentId = "2"; 
  let docAsHtml3 = createHtmlDefinitionDoc('3_88352_WA_DMV_LemonLaw.html');
  docAsHtml3.documentId = "3"; 
  let docAsHtml4 = createHtmlDefinitionDoc('4_85821 DCAP WA Payoff Release.html');
  docAsHtml4.documentId = "4"; 
  let docAsHtml5 = createHtmlDefinitionDoc('5_43894_Law_Contract.html');
  docAsHtml5.documentId = "5"; 
  let docAsHtml6 = createHtmlDefinitionDoc('6_RetailSpotDelivery.html');
  docAsHtml6.documentId = "6"; 
  let docAsHtml7 = createHtmlDefinitionDoc('7_92844_Odometer.html');
  docAsHtml7.documentId = "7"; 
  let docAsHtml8 = createHtmlDefinitionDoc('8_CreditScoreSummary.html');
  docAsHtml8.documentId = "8";
  let docAsHtml9 = createHtmlDefinitionDoc('9_FactAct.html');
  docAsHtml9.documentId = "9";
  let docAsHtml10 = createHtmlDefinitionDoc('10_AgreementToProvideIns.html');
  docAsHtml10.documentId = "10";
  let docAsHtml11 = createHtmlDefinitionDoc('11_ConsumerLoan.html');
  docAsHtml11.documentId = "11";
  let docAsHtml12 = createHtmlDefinitionDoc('12_W9.html');
  docAsHtml12.documentId = "12";

/*
  // Responsive Option 2 = PDF sent via htmlDefinition
  let docAsPDFResponsive = createResponsivePdfDoc("Responsive.pdf", docs.pdfdoc1());
  docAsPDFResponsive.documentId = "9"; 

  // Non-Responsive HTML = Send HTML as base64 to be converted to PDF for signing  
  let docAsHtmlBase64 = createHtmlBase64Doc('1_AgreementNotExport.html');
  docAsHtmlBase64.documentId = "9";

  // Non-Responsive PDF = Send PDF as PDF
  let docAsPdf = createBasicPdfDoc("Normal.pdf", docs.pdfdoc1());
  docAsPdf.documentId = "10"; 

  // Random Tests
  let docTest = createHtmlDefinitionDoc('Test2.html');
  docTest.documentId = "1";
*/

  // NOTE: The order of array dictates order in envelope
  // env.documents = [docAsHtml, docAsHtml2, docAsHtml3, docAsHtml4, docAsHtml5, docAsHtml6, docAsHtml7, docAsHtml8, docAsHtml9, docAsHtml10, docAsHtml11, docAsHtml12];
  //env.documents = [docAsHtml8, docAsHtml9, docAsHtml3, docAsHtml5, docAsHtml6, docAsHtml7];
  
env.documents = [docAsHtml7, docAsHtml8];

  // Construct Signer
  let signer1 = docusign.Signer.constructFromObject({
    email: args.signerEmail,
    name: args.signerName,
    recipientId: args.recipientId,
    clientUserId: args.clientUserId,    
    routingOrder: "1",
  });

  // JSON tags for HTML signature injection
  // NOTE: Having this requires you to send an HTML with a signature tab. If not, remove it from the signer1Tabs below.
  let signHere1 = docusign.SignHere.constructFromObject({
    stampType: "signature",
    name: "SignHere",
    tabLabel: "signatureTab",
    scaleValue: "1",
    optional: "false",
    documentId: "1",
    recipientId: "1"
  });

  // Anchor tags for PDF example
  let signHere2 = docusign.SignHere.constructFromObject({
    anchorString: "By signing this Agreement to Provide Insurance",
    anchorYOffset: "20",
    anchorUnits: "pixels",
    anchorXOffset: "0"
  });

  let signer1Tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere1, signHere2],
  });
  signer1.tabs = signer1Tabs;

  let recipients = docusign.Recipients.constructFromObject({
    signers: [signer1]
  });

  env.recipients = recipients;
  env.status = args.status;
  return env;
}

// Read file in as utf8 encoding
// TODO: The synchronous file read is impacting creation time
function readFileUtf8(filename) {  
  const data = fs.readFileSync('html/'+filename,{encoding:'utf8', flag:'r'});
  return data;
}

// Read HTML file in and base64 encode
// TODO: The synchronous file read is impacting creation time
function readFileBase64(filename) {  
  const data = fs.readFileSync('html/'+filename,{encoding:'base64', flag:'r'});
  return data;
}

// Create HTML to be sent Responsive
function createHtmlDefinitionDoc(docName) {
  let doc = new docusign.Document();
  let htmlDef = new docusign.DocumentHtmlDefinition();  
  htmlDef.source = readFileUtf8(docName);
  doc.htmlDefinition = htmlDef; 
  doc.name = docName;   
  return doc;
}

// Create HTML as Base64 to be converted to PDF
function createHtmlBase64Doc(docName) {
  let doc = new docusign.Document();  
  let docb64 = readFileBase64(docName);
  doc.documentBase64 = docb64; 
  doc.fileExtension = "html";  
  doc.name = docName;  
  return doc;
}

// Create PDF to be sent non-Responsive
function createBasicPdfDoc(name, data) {
  let doc = new docusign.Document();
  doc.documentBase64 = data;
  doc.fileExtension = "pdf";
  doc.name = "Normal.pdf"; 
  return doc;
}

// Create PDF to be sent Responsive
function createResponsivePdfDoc(name, data) {
  let doc = new docusign.Document();
  let htmlDef = new docusign.DocumentHtmlDefinition();
  htmlDef.source = "document";
  htmlDef.showMobileOptimizedToggle = "true",
  doc.htmlDefinition = htmlDef; 
  doc.documentBase64 = data;
  doc.name = name; 
  return doc;
}

module.exports = { makeEnvelope };