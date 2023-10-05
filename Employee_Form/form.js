var dbName ="EMPLOYEE-DB";
var relName = "EmpData-TABLE";
var imlUrl ="/api/iml";
var irlUrl ="/api/irl";

var baseUrl ="http://api.login2explore.com:5577";
var connectionToken="90932997|-31949326202403931|90961212";

// setBaseUrl(baseUrl); //using function we can set any url

// functions to disable Control & navigation buttons and form fields.
function disableCtrl(val)
{
   $('#new').prop('disabled',val);
   $('#save').prop('disabled',val);
   $('#edit').prop('disabled',val);
   $('#change').prop('disabled',val);
   $('#reset').prop('disabled',val);
}
function disableNav(val)
{
   $('#first').prop('disabled',val);
   $('#prev').prop('disabled',val);
   $('#next').prop('disabled',val);
   $('#last').prop('disabled',val);
}  
function disableForm(val)
{
   $('#employeeId').prop('disabled',val);
   $('#employeeName').prop('disabled',val);
   $('#basicSalary').prop('disabled',val);
   $('#hra').prop('disabled',val);
   $('#da').prop('disabled',val);
   $('#deduction').prop('disabled',val);
}
function initializeForm(){
   // initialize form by clearing the local storage
   localStorage.removeItem('first_rec_no');
   localStorage.removeItem("last_rec_no");
   localStorage.removeItem("rec_no");

   console.log("Form is being initialized !");
}

function setCurrentRecordNotoLS(jsonObj){
   // setting  the current record no 
   var data = JSON.parse(jsonObj.data);
   localStorage.setItem('rec_no',data.rec_no);
}
function getCurrentRecordNoFromLS(){
   return localStorage.getItem('rec_no');
}

// functions for "First record no"
function setFirstRecordNoToLS(jsonObj){
   var data = JSON.parse(jsonObj.data);
   if(data.rec_no === undefined)
   localStorage.setItem("first_rec_no","0");
   else
   localStorage.setItem("first_rec_no",data.rec_no );

}
function getFirstRecordNoFromLS(){
   return localStorage.getItem('first_rec_no');
}

// functions for Last REcord number
function setLastRecordNoToLS(jsonObj){
   var data = JSON.parse(jsonObj.data);
   if(data.rec_no === undefined)
   localStorage.setItem("last_rec_no","0");
   else
   localStorage.setItem("last_rec_no",data.rec_no );

}
function getLastRecordNoFromLS(){
   return localStorage.getItem('last_rec_no');
}
// /*Some utility functions.*/
// form validation
function validateForm(){
   var empID,empName,empSal,hra,da,deduc;
   empId= $('#employeeId').val();
   empName=$('#employeeName').val();
   empSal=$('#basicSalary').val();
   hra=$('#hra').val();
   da=$('#da').val();
  deduc= $('#deduction').val();
  if(empID==="")
  {
   alert("Employee Id is missing!");
   $('#employeeId').focus();
   return "";
  }
  if(empName==="")
  {
   alert("Employee Name is missing!");
   $('#employeeName').focus();
   return "";
  }
  if(empSal==="")
  {
   alert("Employee Salary is missing!");
   $('#basicSalary').focus();
   return "";
  }
  if(hra==="")
  {
   alert("HRA is missing!");
   $('#hra').focus();
   return "";
  }
  if(da==="")
  {
   alert("DA is missing!");
   $('#da').focus();
   return "";
  }
  var jsonStrObj={
   id: empId,
   name:empName,
   salary:empSal,
   hra: hra,
   da: da,
   deduction :deduc
  };
  return JSON.stringify(jsonStrObj);
}
// control functions
function newForm(){
   // make form fields empty
   disableForm(false);
   $('#employeeId').val("");
   $('#employeeName').val("");
   $('#basicSalary').val("");
   $('#hra').val("");
   $('#da').val("");
   $('#deduction').val("");
   disableCtrl(true);
   disableNav(true);
   $('#employeeId').focus();
   $('#save').prop('disabled',false);
   $('#reset').prop('disabled',false);
}
function resetForm(){
   disableCtrl(true);
   disableNav(false);
   var getCurrRequest=createGET_BY_RECORDRequest(connectionToken, dbName, relName, getCurrentRecordNoFromLS());
   jQuery.ajaxSetup({async: false});
   var resultObj = executeCommand(getCurrRequest,irlUrl);
   showData(resultObj);
   jQuery.ajaxSetup({async: true});
if(onlyOneRecord() || noRecord())
{ disableNav(true);}
$("#new").prop("disabled",false);
if(noRecord())
{
   $('#employeeId').val("");
   $('#employeeName').val("");
   $('#basicSalary').val("");
   $('#hra').val("");
   $('#da').val("");
   $('#deduction').val("");
   $('#edit').prop('disabled',true);
}
else
{
   $('#edit').prop('disabled',false);
}

disableForm(true);
}
function showData(jsonObj){
   if(jsonObj.status===400){
      return;
   }
   var data=(JSON.parse(jsonObj.data)).record;
   setCurrentRecordNotoLS(jsonObj);
   $('#employeeId').val(data.id);
   $('#employeeName').val(data.name);
   $('#basicSalary').val(data.salary);
   $('#hra').val(data.hra);
   $('#da').val(data.da);
   $('#deduction').val(data.deduction);
   disableNav(false);
   disableForm(true);
   $('#save').prop('disabled',true);
   $('#change').prop('disabled',true);
   $('#reset').prop('disabled',true);
   $('#new').prop('disabled',false);
   $('#edit').prop('disabled',false);

   if(getCurrentRecordNoFromLS()===getFirstRecordNoFromLS()){
      $('#first').prop('disabled',true);
      $('#prev').prop('disabled',true);
      return;
   }
}

function firstRecord(){
   var getFirstRequest= createFIRST_RECORDRequest(connectionToken, dbName, relName);
   jQuery.ajaxSetup({async: false});
   var resultObj = executeCommand(getFirstRequest,irlUrl);
   setFirstRecordNoToLS(resultObj);
   showData(resultObj);
   jQuery.ajaxSetup({async: true});
   $('#employeeId').prop('disabled',true);
   $('#first').prop('disabled',true);
   $('#prev').prop('disabled',true);
   $('#next').prop('disabled',false);
   $('#save').prop('disabled',true);
}
function  prevRecord(){
   var r=getCurrentRecordNoFromLS();
   if(r===1)
   {
      $('#first').prop('disabled',true);
      $('#prev').prop('disabled',true);
   }
   var getPrevRequest= createPREV_RECORDRequest(connectionToken, dbName, relName,r);
   jQuery.ajaxSetup({async: false});
   var resultObj = executeCommand(getPrevRequest,irlUrl);
   showData(resultObj);
   jQuery.ajaxSetup({async: true});
   var r=getCurrentRecordNoFromLS();
   if(r===1)
   {
      $('#first').prop('disabled',true);
      $('#prev').prop('disabled',true);
   }
    $('#save').prop('disabled',true);
}

function nextRecord() {
   var r=getCurrentRecordNoFromLS();
   var getNextRequest=createNEXT_RECORDRequest(connectionToken, dbName, relName,r);
   jQuery.ajaxSetup({async: false});
   var resultObj = executeCommand(getNextRequest,irlUrl);
   showData(resultObj);
   jQuery.ajaxSetup({async: true});
   $('#save').prop('disabled',true);
}

function lastRecord(){
   var getLastRequest=createLAST_RECORDRequest(connectionToken, dbName, relName);
   jQuery.ajaxSetup({async: false});
   var resultObj = executeCommand(getLastRequest,irlUrl);
   setLastRecordNoToLS(resultObj);
   showData(resultObj);
   jQuery.ajaxSetup({async: true});
   $('#first').prop('disabled',false);
   $('#prev').prop('disabled',false);
   $('#last').prop('disabled',true);
   $('#next').prop('disabled',true);
   $('#save').prop('disabled',true);
}

function saveForm(){
   var jsonStrObj= validateForm();
   if(jsonStrObj===""){
      return "";
   }
   var putRequest= createPUTRequest(connectionToken,jsonStrObj, dbName, relName);
   jQuery.ajaxSetup({async: false});
   var resultObj = executeCommand(putRequest,imlUrl);
   jQuery.ajaxSetup({async: true});
   if(noRecord()){
      setFirstRecordNoToLS(resultObj);
   }
   setLastRecordNoToLS(resultObj);
   setCurrentRecordNotoLS(resultObj);
   resetForm();
   alert("Record saved");
}
function editForm(){
   disableForm(false);
   $('#employeeId').prop('disabled',true);
   $('#employeeName').focus();
   disableNav(true);
   disableCtrl(true);
   $('#change').prop('disabled',false);
   $('#reset').prop('disabled',false);
}
function updateForm(){
   jsonChg=validateForm();
   var updateRequest=createUPDATERecordRequest(connectionToken,jsonChg, dbName, relName,getCurrentRecordNoFromLS());
   jQuery.ajaxSetup({async: false});
   var resultObj = executeCommandAtGivenBaseUrl(updateRequest,baseUrl,imlUrl);
   jQuery.ajaxSetup({async: true});
   console.log(jsonObj);
   resetForm();
   $('#employeeId').focus();
   // $('#edit').focus();
}

function noRecord(){
   if(getFirstRecordNoFromLS()==='0' && getLastRecordNoFromLS()==="0"){
      return true;
   }
   return false;
}

function onlyOneRecord(){
   if(noRecord()){
      return false;

   }
   if(getFirstRecordNoFromLS()===getLastRecordNoFromLS()){
      return true;
   }
   return false;
}

function checkForNoOrOneRecord(){
   if(noRecord()){
      disableForm(true);
      disableNav(true);
      disableCtrl(true);
      $('#new').prop('disabled',false)
      return;

   }
   if(onlyOneRecord()){
      disableForm(true);
      disableNav(true);
      disableCtrl(true);
      $('#new').prop('disabled',false)
      $('#edit').prop('disabled',false)
      return;
   }
}
initializeForm();
firstRecord();
lastRecord();
checkForNoOrOneRecord();