(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["attendance~common~csmstimetable~infoPublic~schoolAffairs"],{"4ff6":function(e,t,a){var s=a("a1a8");t=s(!1),t.push([e.i,".select-teacher-org[data-v-10138a0a]{position:relative;top:20px;bottom:20px}.select-teacher-org .center-serch-wrap[data-v-10138a0a]{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-ms-flex-align:center;align-items:center;margin:10px}.select-teacher-org .center-serch-wrap .casader-search[data-v-10138a0a]{width:300px}",""]),e.exports=t},"53d2":function(e,t,a){e.exports=a.p+"img/loading.517158b6.png"},"6b15":function(e,t,a){"use strict";var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Modal",{staticClass:"select-teacher-org",attrs:{styles:{top:"20px",width:"90%"},title:e.modalTitle,transfer:!1,value:e.isShow,"mask-closable":!1,closable:!1}},[a("Row",{staticClass:"cascader-content"},[a("i-col",{staticClass:"cascader-content-left",attrs:{span:"16"}},[a("div",{staticClass:"cascader-content-left-search"},[a("Alert",{attrs:{"show-icon":""}},[e._v("点击左侧栏组织，中间栏勾选用户，右侧栏显示已选用户。")]),a("i-input",{staticClass:"casader-search",staticStyle:{width:"300px"},attrs:{search:"","enter-button":"",placeholder:"请输入姓名/用户名"},on:{"on-search":e.searchNameFun},model:{value:e.modalSearchName,callback:function(t){e.modalSearchName=t},expression:"modalSearchName"}},[a("Select",{staticStyle:{width:"80px"},attrs:{slot:"prepend"},on:{"on-change":e.changeSearchType},slot:"prepend",model:{value:e.searchType,callback:function(t){e.searchType=t},expression:"searchType"}},[a("Option",{attrs:{value:"1"}},[e._v("局部")]),a("Option",{attrs:{value:"2"}},[e._v("全局")])],1)],1)],1),a("Row",[a("i-col",{staticClass:"cascader-content-left",attrs:{span:"8"}},[a("Tree",{staticClass:"tree-list",attrs:{data:e.newList},on:{"on-select-change":e.treeSelect}})],1),a("i-col",{staticClass:"cascader-content-center",attrs:{span:"16"}},[a("div",{staticClass:"center-serch-wrap"},[e.transferData.length>1&&""===e.modalSearchName&&"1"===e.isSearchType&&"全选"!==e.transferData[0].label||"2"===e.isSearchType&&e.transferData.length>1?a("checkbox",{on:{"on-change":e.checkAllBtn},model:{value:e.casaderIsAll,callback:function(t){e.casaderIsAll=t},expression:"casaderIsAll"}},[e._v("全选")]):e._e()],1),0===e.transferData.length?a("Alert",{staticStyle:{margin:"0px 0px 20px"},attrs:{type:"warning","show-icon":""}},[e._v(" 未查询到相关信息 "),a("template",{slot:"desc"},[e._v(" 当前分组下暂无信息，请切换分组后重新查找。 ")])],2):a("div",e._l(e.transferData,(function(t){return a("div",{key:t.childNameStr},[t.memberlist.length>0?a("div",{staticClass:"cascader-content-center-list"},[a("div",{staticClass:"cascader-content-center-list-border"},[""===e.modalSearchName||"2"===e.isSearchType?a("checkbox",{key:t.value,attrs:{size:"large"},on:{"on-change":function(a){return e.handleCheckAll(t)}},model:{value:t.CheckAll,callback:function(a){e.$set(t,"CheckAll",a)},expression:"item.CheckAll"}},[e._v(e._s(t.label)+" ")]):a("span",[e._v(e._s(t.label))])],1),e._l(t.memberlist,(function(s){return["2"===e.isSearchType||"1"===e.isSearchType&&(s.FullName.indexOf(e.modalSearchName)>=0||""==e.modalSearchName||s.UserName.indexOf(e.modalSearchName)>=0)?a("checkbox",{key:s.UserID,staticClass:"check-name",attrs:{size:"large",title:s.UserName},on:{"on-change":function(a){return e.checkAllChange(s,t)}},model:{value:s.singleCheck,callback:function(t){e.$set(s,"singleCheck",t)},expression:"child.singleCheck"}},[e._v(" "+e._s(s.FullName)+" ")]):e._e()]}))],2):e._e()])})),0)],1)],1)],1),a("i-col",{staticClass:"cascader-content-right",attrs:{span:"8"}},[a("div",{staticClass:"title"},[e._v("已选"),a("b",[e._v(e._s(e.checkAllList.length))]),e._v("人")]),a("div",{staticClass:"cascader-content-right-list"},e._l(e.checkAllList,(function(t){return a("Tag",{key:t.UserID,staticClass:"checked-list",attrs:{name:t.UserID,closable:"",title:t.UserName},on:{"on-close":e.handleClose}},[e._v(e._s(t.FullName)+" ")])})),1)])],1),e.isLoadingShow?a("Spin",{attrs:{fix:""}},[a("icon",{staticClass:"spin-icon-load",attrs:{type:"ios-loading",size:"18"}}),a("div",[e._v("加载中...")])],1):e._e(),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{staticClass:"xy-modal-close",on:{click:e.modalCancel}},[e._v("取消")]),a("Button",{staticClass:"xy-modal-primary",attrs:{shape:"circle"},on:{click:e.modalConfirm}},[e._v("确定")])],1)],1)},r=[],i=(a("84bc"),a("fe59"),a("ecb4"),a("2eeb"),a("ea69"),a("e18c"),a("34d9"),a("96db"),a("08ba"),a("af86"),a("5748")),n=a("5412"),l=a.n(n),c=(a("b449"),a("cf7f")),h={name:"SelectStudent",props:{isShowSelectAll:{type:Boolean,default:!0},modalTitle:{type:String,default:"选择学生"},isShow:{type:Boolean,required:!0},teachers:{type:Array,required:!0}},data:function(){return{searchType:"1",isSearchType:"1",modalSearchName:"",casaderIsAll:!1,isLoadingShow:!1,newList:[],transferData:[],checkAllList:[],checkAllGroup:[],isDataList:!1,schoolDistrictID:0,studentGradeID:0,studentGradeForStudentYearID:0,studentOrganizationID:0,selectClassID:""}},created:function(){},updated:function(){},watch:{isShow:function(e){e&&this.openAddModal()},transferData:function(e){if(e.length>0){var t=e.every((function(e){return!0===e.CheckAll}));this.casaderIsAll=t}else this.casaderIsAll=!1}},methods:{modalCancel:function(){this.casaderIsAll=!1,this.newList=[],this.transferData=[],this.checkAllList=[],this.searchType="1",this.isSearchType="1",this.modalSearchName="",this.$emit("select-cancel")},modalConfirm:function(){this.checkAllList.length>0?(this.searchType="1",this.isSearchType="1",this.$emit("select-confirm",this.checkAllList)):this.xy.msgError("请先选择学生。")},openAddModal:function(){var e=this;return Object(c["a"])(l.a.mark((function t(){var a,s,r,i,n,c,h;return l.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.newList=[],e.transferData=[],e.checkAllList=[],e.modalSearchName="",e.isLoadingShow=!1,a={id:0,type:""},t.next=8,e.xy.get(e.xyApi+"/xy/Comm/StudentOrganization",a);case 8:if(s=t.sent,s.success)for(r=s.data,i=0;i<r.length;i++)if(e.newList.push({id:r[i].ID,title:r[i].Name,nodetype:r[i].Type,loading:!1,index:i,children:[]}),r[i].MemberList.length>0)for(n=0;n<r[i].MemberList.length;n++)if(e.newList[i].children.push({id:r[i].MemberList[n].ID,title:r[i].MemberList[n].Name,nodetype:r[i].MemberList[n].Type,loading:!1,children:[]}),r[i].MemberList[n].MemberList.length>0)for(c=0;c<r[i].MemberList[n].MemberList.length;c++)if(e.newList[i].children[n].children.push({id:r[i].MemberList[n].MemberList[c].ID,title:r[i].MemberList[n].MemberList[c].Name,nodetype:r[i].MemberList[n].MemberList[c].Type,loading:!1,children:[]}),r[i].MemberList[n].MemberList[c].MemberList.length>0)for(h=0;h<r[i].MemberList[n].MemberList[c].MemberList.length;h++)e.newList[i].children[n].children[c].children.push({id:r[i].MemberList[n].MemberList[c].MemberList[h].ID,title:r[i].MemberList[n].MemberList[c].MemberList[h].Name,nodetype:r[i].MemberList[n].MemberList[c].MemberList[h].Type});e.isLoadingShow=!1;case 11:case"end":return t.stop()}}),t)})))()},treeSelect:function(e){this.casaderIsAll=!1,e.length>0&&("S"!==e[0].nodetype?"SD"===e[0].nodetype?this.selectStudent(e[0].id,this.studentGradeID,this.studentGradeForStudentYearID,this.studentOrganizationID):"SY"===e[0].nodetype?this.selectStudent(this.schoolDistrictID,e[0].id,this.studentGradeForStudentYearID,this.studentOrganizationID):"SG"===e[0].nodetype?this.selectStudent(this.schoolDistrictID,this.studentGradeID,e[0].id,this.studentOrganizationID):"SO"===e[0].nodetype&&this.selectStudent(this.schoolDistrictID,this.studentGradeID,this.studentGradeForStudentYearID,e[0].id):this.isLoadingShow=!1)},selectStudent:function(e,t,a,s){var r=this;return Object(c["a"])(l.a.mark((function i(){var n,c,h,o,d,f,m,u,D,p;return l.a.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return n={schoolDistrictID:e,studentGradeID:t,studentGradeForStudentYearID:a,studentOrganizationID:s},r.isLoadingShow=!0,i.next=4,r.xy.get(r.xyApi+"/xy/comm/GetStudentorganizationMemberByID",n);case 4:if(c=i.sent,r.transferData=[],c.success)if(r.isLoadingShow=!1,h=c.data,h.length>0){for(o=0;o<h.length;o++){for(h[o].label=h[o].Name,h[o].CheckAll=!1,h[o].checkAllGroup=[],d=0;d<h[o].Children.length;d++)h[o].Children[d].singleCheck=!1,h[o].childNameStr+=h[o].Children[d].FullName+","+h[o].Children[d].UserName+",",h[o].Children[d].FullName=c.data[o].Children[d].FullName,h[o].Children[d].UserID=c.data[o].Children[d].UserID;h[o].memberlist=h[o].Children,r.transferData.push(h[o]),r.isLoadingShow=!1}if(r.checkAllList.length>0)for(f=0;f<r.transferData.length;f++){for(m=0;m<r.transferData[f].memberlist.length;m++)u=r.checkAllList.map((function(e){return e.UserID})).indexOf(r.transferData[f].memberlist[m].UserID),-1!==u&&(r.transferData[f].memberlist[m].singleCheck=!0);D=r.transferData[f].memberlist.map((function(e){return e.singleCheck})).indexOf(!0),-1===D?(r.transferData[f].CheckAll=!1,r.casaderIsAll=!1):(p=r.transferData[f].memberlist.map((function(e){return e.singleCheck})).indexOf(!1),-1===p?(r.transferData[f].CheckAll=!0,r.casaderIsAll=!0):(r.transferData[f].CheckAll=!1,r.casaderIsAll=!1))}r.isLoadingShow=!1}else r.isLoadingShow=!1,r.transferData=[];case 7:case"end":return i.stop()}}),i)})))()},checkAllBtn:function(){if(this.casaderIsAll){for(var e=0;e<this.transferData.length;e++){this.transferData[e].CheckAll=!0;for(var t=0;t<this.transferData[e].memberlist.length;t++)this.transferData[e].memberlist[t].singleCheck=!0,this.checkAllList.push(Object.assign({},this.transferData[e].memberlist[t],{StudentOrganizationID:this.transferData[e].StudentOrganizationID,SchoolDistrictID:this.transferData[e].SchoolDistrictID,StudentGradeForStudentYearID:this.transferData[e].StudentGradeForStudentYearID,StudentGradeID:this.transferData[e].StudentGradeID}))}this.checkDuplicateRemoval(this.checkAllList)}else for(var a=0;a<this.transferData.length;a++){this.transferData[a].CheckAll=!1;for(var s=0;s<this.transferData[a].memberlist.length;s++){this.transferData[a].memberlist[s].singleCheck=!1;for(var r=0;r<this.checkAllList.length;r++)this.checkAllList[r].UserID===this.transferData[a].memberlist[s].UserID&&this.checkAllList.splice(r,1)}}},checkDuplicateRemoval:function(e){var t=this,a=e.map((function(e){return e.UserID}));a=Object(i["a"])(new Set(a)),this.checkAllList=[],e.forEach((function(e){a.indexOf(e.UserID)>-1&&(a.splice(a.indexOf(e.UserID),1),t.checkAllList.push(e))}))},handleCheckAll:function(e){if(e.CheckAll){e.memberlist.map((function(e){return e.singleCheck=!0}));for(var t=0;t<this.transferData.length;t++){for(var a=0;a<this.transferData[t].memberlist.length;a++){for(var s=0;s<e.memberlist.length;s++)this.transferData[t].memberlist[a].UserID===e.memberlist[s].UserID&&(this.transferData[t].memberlist[a].singleCheck=!0);this.transferData[t].memberlist[a].singleCheck&&this.checkAllList.push(Object.assign({},this.transferData[t].memberlist[a],{StudentOrganizationID:this.transferData[t].StudentOrganizationID,SchoolDistrictID:this.transferData[t].SchoolDistrictID,StudentGradeForStudentYearID:this.transferData[t].StudentGradeForStudentYearID,StudentGradeID:this.transferData[t].StudentGradeID}))}var r=this.transferData[t].memberlist.map((function(e){return e.singleCheck})).indexOf(!1);this.transferData[t].CheckAll=-1===r}this.checkDuplicateRemoval(this.checkAllList)}else for(var i=0;i<this.transferData.length;i++){for(var n=0;n<this.transferData[i].memberlist.length;n++){var l=e.memberlist.map((function(e){return e.UserID})).indexOf(this.transferData[i].memberlist[n].UserID);-1!==l&&(this.transferData[i].memberlist[n].singleCheck=!1)}for(var c=0;c<e.memberlist.length;c++){var h=this.checkAllList.map((function(e){return e.UserID})).indexOf(e.memberlist[c].UserID);-1!==h&&this.checkAllList.splice(h,1)}var o=this.transferData[i].memberlist.map((function(e){return e.singleCheck})).indexOf(!0);if(-1===o)this.transferData[i].CheckAll=!1,this.casaderIsAll=!1;else{var d=this.transferData[i].memberlist.map((function(e){return e.singleCheck})).indexOf(!1);-1===d?(this.transferData[i].CheckAll=!0,this.casaderIsAll=!0):(this.transferData[i].CheckAll=!1,this.casaderIsAll=!1)}}var f=this.transferData.map((function(e){return e.CheckAll})).indexOf(!1);this.casaderIsAll=-1===f},checkAllChange:function(e,t){if(e.singleCheck){this.checkAllList.push(Object.assign({},e,{StudentOrganizationID:t.StudentOrganizationID,SchoolDistrictID:t.SchoolDistrictID,StudentGradeForStudentYearID:t.StudentGradeForStudentYearID,StudentGradeID:t.StudentGradeID}));for(var a=0;a<this.transferData.length;a++){var s=this.transferData[a].memberlist.map((function(e){return e.UserID})).indexOf(e.UserID);-1!==s&&(this.transferData[a].memberlist[s].singleCheck=!0);var r=this.transferData[a].memberlist.map((function(e){return e.singleCheck})).indexOf(!1);-1===r&&(this.transferData[a].CheckAll=!0,this.casaderIsAll=!0)}}else{var i=this.checkAllList.map((function(e){return e.UserID})).indexOf(e.UserID);this.checkAllList.splice(i,1);for(var n=0;n<this.transferData.length;n++){var l=this.transferData[n].memberlist.map((function(e){return e.UserID})).indexOf(e.UserID);-1!==l&&(this.transferData[n].memberlist[l].singleCheck=!1);var c=this.transferData[n].memberlist.map((function(e){return e.singleCheck})).indexOf(!0);if(-1===c)this.transferData[n].CheckAll=!1,this.casaderIsAll=!1;else{var h=this.transferData[n].memberlist.map((function(e){return e.singleCheck})).indexOf(!1);-1===h?(this.transferData[n].CheckAll=!0,this.casaderIsAll=!0):(this.transferData[n].CheckAll=!1,this.casaderIsAll=!1)}}}},searchNameFun:function(e){"1"===this.searchType?this.modalSearchName=e:""!==this.modalSearchName?this.allSearch():this.xy.msgError("请输入要搜索的用户。")},allSearch:function(){var e=this;this.xy.loading(),this.xy.get("".concat(this.xyApi,"/base/api/Users/FuzzySearch"),{word:this.modalSearchName,userRoleType:3}).then((function(t){if(e.isLoadingShow=!0,e.transferData=[],t.success)if(t.data.length>0){e.isDataList=!1,e.transferData=[{label:"全选",CheckAll:!1,checkAllGroup:[],memberlist:[]}];for(var a=0;a<t.data.length;a++)e.transferData[0].memberlist.push({FullName:t.data[a].FullName,UserName:t.data[a].UserName,UserID:t.data[a].UserID,SchoolCardNumber:t.data[a].SchoolCardNumber,singleCheck:!1,childNameStr:t.data[a].FullName+","+t.data[a].UserName+","});if(console.log(e.transferData),e.checkAllList.length>0)for(var s=0;s<e.transferData.length;s++){for(var r=0;r<e.transferData[s].memberlist.length;r++){var i=e.checkAllList.map((function(e){return e.UserID})).indexOf(e.transferData[s].memberlist[r].UserID);-1!==i&&(e.transferData[s].memberlist[r].singleCheck=!0)}var n=e.transferData[s].memberlist.map((function(e){return e.singleCheck})).indexOf(!0);if(-1===n)e.transferData[s].CheckAll=!1,e.casaderIsAll=!1;else{var l=e.transferData[s].memberlist.map((function(e){return e.singleCheck})).indexOf(!1);-1===l?(e.transferData[s].CheckAll=!0,e.casaderIsAll=!0):(e.transferData[s].CheckAll=!1,e.casaderIsAll=!1)}}}else e.isDataList=!0;else e.isDataList=!0;e.isLoadingShow=!1,e.xy.unloading()}))},changeSearchType:function(e){this.searchType=e,this.isSearchType=e},handleClose:function(e,t){for(var a=0;a<this.checkAllList.length;a++)this.checkAllList[a].UserID===t&&this.checkAllList.splice(a,1);for(var s=0;s<this.transferData.length;s++){var r=this.transferData[s].memberlist.map((function(e){return e.UserID})).indexOf(t);-1!==r&&(this.transferData[s].memberlist[r].singleCheck=!1);var i=this.transferData[s].memberlist.map((function(e){return e.singleCheck})).indexOf(!0);if(-1===i)this.transferData[s].CheckAll=!1,this.casaderIsAll=!1;else{var n=this.transferData[s].memberlist.map((function(e){return e.singleCheck})).indexOf(!1);-1===n?(this.transferData[s].CheckAll=!0,this.casaderIsAll=!0):(this.transferData[s].CheckAll=!1,this.casaderIsAll=!1)}}}}},o=h,d=(a("8fdf"),a("9ca4")),f=Object(d["a"])(o,s,r,!1,null,"10138a0a",null);t["a"]=f.exports},"8fdf":function(e,t,a){"use strict";var s=a("befb"),r=a.n(s);r.a},befb:function(e,t,a){var s=a("4ff6");"string"===typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);var r=a("85cb").default;r("27fe6a7f",s,!0,{sourceMap:!1,shadowMode:!1})}}]);