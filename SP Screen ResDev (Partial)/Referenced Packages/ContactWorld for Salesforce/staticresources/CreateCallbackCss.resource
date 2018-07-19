
.quickActionPanel input[type="text"],
.quickActionPanel textarea {
  overflow: auto;
  border: 1px solid #c7ccce;
  border-radius: 3px;
  width: 100%;
  padding: 0 7px;
  box-sizing: border-box;
  margin: 0;
}
label {
  font-size: .917em;
}
.quickActionPanel textarea {
  height: 70px;
  padding: 5px 7px;
}
.quickActionPanel input[type="text"] {
  height: 33px;
}
.quickActionPanel .dueDate .quickActionFieldElement {
  width: 50%;
}

.quickActionPanel .dateInput .dateFormat {
  color: #fff;
  position: absolute;
  right: -5px;
  top: -23px;
}
.quickActionPanel .dateInput .dateFormat a {
  color: #888;
  text-decoration: underline;
  font-size: 92%;
}

.quickActionPanel label {
  color:#222;
  font-weight:700;
}
.quickActionFieldTimeLabel {
  position: absolute;
  top: 2px;
  left: 263px;
}

.quickActionPanel select {
  width: 49%; 
  position: absolute;
  top: 16px;
  right: 0;
  z-index:1;
  cursor: pointer;
  background: white;
  font-family:'Arial','Helvetica',san-serif;
  color:#222;
  font-padding:10px;
  padding:7px 0;
  border:1px solid #c7ccce;
  -moz-border-radius:3px;
  -webkit-border-radius:3px;
  border-radius:3px;
  padding:7px;
  -webkit-box-sizing:border-box;
  -moz-box-sizing:border-box;
  box-sizing:border-box;
  margin:0;
}
.quickActionPanel .lookupIcon,
.quickActionPanel .lookupIconOn {
  background-image:url(/img/chatter/lookupSearch.png);
  position:absolute;
  right:10px;
  top:7px;
  height:16px;
  width:16px;
  padding:0;
  margin:0;
  border:none;
}
.quickActionForm {
  height: 200px;
}
.quickActionFieldLabel {
  padding:2px 0;
}

.quickActionFieldElement {
  line-height:30px;
  position:relative;
}

.quickActionBottomBar {
  padding:9px;
  height:30px;
  line-height:30px;
  background:#f5f6f6;
  border:1px solid #c7ccce;
  -moz-border-radius:3px 0;
  border-radius:0 0 3px 3px;
}

.quickActionBottomBar input[type="button"] {
  font-family:Arial;
  font-size:1.08em;
  border:1px solid #6c8049;
  background:#8ab529;
  background: -ms-linear-gradient(top,#8AB529 0,#87AC31 100%);
  background: -moz-linear-gradient(top,#8AB529 0,#87AC31 100%);
  background: -webkit-linear-gradient(top,#8AB529 0,#87AC31 100%);
  background: linear-gradient(top,#8AB529 0,#87AC31 100%);
  display:inline-block;
  padding:0 10px 1px;
  height:30px;
  color:#fff;
  -moz-border-radius:3px;
  border-radius:2px;
  -moz-box-shadow:0 1px 2px 0 #adadad;
  -webkit-box-shadow:0 1px 2px 0 #adadad;
  box-shadow:0 1px 2px 0 #adadad;
  margin:0;
  float:right;
}
.quickActionBottomBar input[type="button"]:hover {
  background: #a0cb3d;
  background: -ms-linear-gradient(top,#a5cd48 0,#97bf3a 100%);
  background: -moz-linear-gradient(top,#a5cd48 0,#97bf3a 100%);
  background: -webkit-linear-gradient(top,#a5cd48 0,#97bf3a 100%);
  background: linear-gradient(top,#a5cd48 0,#97bf3a 100%);
}
.required {
  color: red;
}