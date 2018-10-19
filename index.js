/*
  form表单行为
*/
var form = document.forms[0];
var formBtn = form.getElementsByTagName('button')[0];
var inputs = form.getElementsByTagName('input');
var error = [];
var obj = {};
//表单验证、 验证通过打包成对象
inputs[0].onblur = function(){
	var reg = /^[\u4e00-\u9fa5]{2,4}$/;
	if(!reg.test(inputs[0].value)){
		alert('请输入中文姓名');
		error[0] = 0;
	}else{
		error[0] = 1;
		obj[inputs[0].name] = inputs[0].value;
	}
}
inputs[1].onblur = function(){
	var reg = /^\d{1,2}$/;
	if(!reg.test(inputs[1].value)){
		alert('请输入合法年龄');
		error[1] = 0;
	}else{
		error[1] = 1;
		obj[inputs[1].name] = inputs[1].value;
	}
}

inputs[4].onblur = function(){
	var reg = /^\d{11}$/;
	if(!reg.test(inputs[4].value)){
		alert('请输入11位的电话号码');
		error[2] = 0;
	}else{
		error[2] = 1;
		obj[inputs[4].name] = inputs[4].value;
	}
}
//阻止表单默认提交功能
form.onsubmit = function(e){
	e.preventDefault();
}
//提交数据给数据库
formBtn.onclick = function(){
	var errorNum = 0;
	for(var i = 2; i <=3; i++){
		if(inputs[i].checked){
			obj[inputs[i].name] = inputs[i].value;
		}
	}
	for(var j in error){
		errorNum += error[j];
	}
	if(errorNum == error.length){
		addData(obj);
	}else{
		alert('输入不合法');
	}
}
/*
	数据库行为
*/
function getConnection(handler){
	//1.创建数据库
	var request = indexedDB.open("users");
	request.onsuccess=function(event){
		if(handler){
			handler(event.target.result);
		}
	}
	request.onupgradeneeded=function(event){
		//2.获取数据库
		var db=event.target.result;
		//3.创建表
		db.createObjectStore("web1801",{
            keyPath:"stuId",
            autoIncrement:true
        });
	}
}
getConnection();
function addData(obj){
	//添加数据
	getConnection(function(db){
		//4.开启事务对象
	    var t=db.transaction(["web1801"],"readwrite");
	    //5.获取表
	    var store=t.objectStore("web1801");
	    //6.保存数据
	    store.put(obj);
	});
}
function deleteData(arr){
	//删除数据
	getConnection(function(db){
		//4.开启事务对象
        var t=db.transaction(["web1801"],"readwrite");
        //5.获取表
        var store=t.objectStore("web1801");
        //6.保存数据
        store.delete(Number(arr));
	});
}
function showAllData(){
	//展示所有数据
	getConnection(function(db){
		//4.开启事务对象
	    var t=db.transaction(["web1801"],"readwrite");
	    //5.获取表
	    var store=t.objectStore("web1801");
	    //6.保存数据
	    var arrs=store.getAll();
        arrs.onsuccess = function(event){
        	var leght = 0;
        	var array = event.target.result;
        	var tr = tbody.getElementsByTagName('tr');
			for(var i in tr){
				if(tr.length >= 1){
					tbody.removeChild(tr[tr.length-1]);
				}
			}
        	for(var i in array){
        		createRow();
        		var tr = tbody.getElementsByTagName('tr');
        		var td = tr[i].getElementsByTagName('td');
    			td[0].innerHTML = array[i].stuId;
    			td[1].innerHTML = array[i].name;
    			td[2].innerHTML = array[i].age;
    			td[3].innerHTML = array[i].sex;
    			td[4].innerHTML = array[i].tel;
        	}
        }
	});
}
function selectData(){
	//查询数据
	getConnection(function(db){
		//4.开启事务对象
	    var t=db.transaction(["web1801"],"readwrite");
	    //5.获取表
	    var store=t.objectStore("web1801");
	    //6.保存数据
	    var arrs=store.getAll();
        arrs.onsuccess = function(event){
        	var leght = 0;
        	var j = 0;
        	var array = event.target.result;
        	var tr = tbody.getElementsByTagName('tr');
        	if(tr.length >= array.length){
				for(var i in tr){
					if(tr.length >= 1){
						tbody.removeChild(tr[tr.length-1]);
					}
				}
			}
        	for(var i in array){
        		var selectChild = select.children[0].value;
        		var reg = new RegExp(selectChild);
        		if(reg.test(array[i].name)){
        			createRow();
	        		var tr = tbody.getElementsByTagName('tr');
	        		var td = tr[j++].getElementsByTagName('td');
	    			td[0].innerHTML = array[i].stuId;
	    			td[1].innerHTML = array[i].name;
	    			td[2].innerHTML = array[i].age;
	    			td[3].innerHTML = array[i].sex;
	    			td[4].innerHTML = array[i].tel;
        		}
        	}
        }
	});
}
/*
	表格行为
*/
var table = document.getElementsByClassName('table')[0];
var tbody = table.getElementsByTagName('tbody')[0];
var select = document.getElementsByClassName('select')[0];
var selectChild = select.children;
var opera = document.getElementsByClassName('opera')[0];
var operaBtn = opera.children;
//插入新行
function createRow(){
	var tr = document.createElement('tr');
	for(var i = 0; i < 6; i++){
		var td = document.createElement('td');
		tr.appendChild(td);
	}
	td.innerHTML = '<input type="checkbox">';
	tbody.appendChild(tr);
}
//查询数据库中所有学生
operaBtn[0].onclick = function(){
	showAllData();
}
//删除选中的数据库中的学生项
operaBtn[1].onclick = function(){
	var tr = tbody.getElementsByTagName('tr');
	for(var i = 0; i < tr.length; i++){
		var td = tr[i].getElementsByTagName('td')[5];
		var check = td.children[0];
		if(check.checked){
			deleteData(check.parentNode.parentNode.children[0].innerHTML);
		}
	}
	if(tr.length > 0){
		showAllData();
	}
}
//按条件查询数据库中学生
selectChild[1].onclick = function(){
	showAllData();
	selectData();
}