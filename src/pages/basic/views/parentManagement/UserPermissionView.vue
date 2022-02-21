<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="title-font fl">
        查看
        <span class="main-font" v-cloak>{{userModel.FullName}}（{{userModel.UserName}}） </span>
        的所有权限
      </div>
    </div>
    <div class="xy-content-body">
      <div v-for="(item, index) in permissionList" :key="item.Name + index" class="permissiong-box">
        <div class="permissiong-box-title">{{item.Name}}</div>
        <div class="permissiong-box-content">
          <div class="child-list" :key="child1.Name + index1" v-for="(child1, index1) in item.applications">
            <div class="permissiong-box-content-title">
              <div class="operation-name" :class="child1.PermissionArr.length>0?'active':'no-active'">{{child1.Name}}</div>
              <div v-if="child1.PermissionArr.length>0&&child1.subMenu.length==0" class="f12" style="color:#DDDEE0;">
                <span>来自：</span>
                <span v-for="(child1Item, indexs1) in child1.PermissionArr" :key="child1Item + indexs1">{{child1Item}}</span>
              </div>
            </div>
            <div class="child-flex clearfix">
              <div v-for="(child2, index2) in child1.subMenu" :key="child2.Name + index2" class="fl">
                <div class="operation-name f14 child2-name" :class="child2.PermissionArr.length>0?'active':'no-active'"><b>{{child2.Name}}</b></div>
                <div v-if="child2.PermissionArr.length>0&&child2.OperationPermissionList.length==0" class="f12" style="color:#DDDEE0;">
                  <span>来自：</span>
                  <span v-for="(child2Item, ind) in child2.PermissionArr" :key="child2Item + ind">{{child2Item}}</span>
                </div>
                <div v-if="child2.OperationPermissionList.length>0" style="margin-top:10px;">
                  <div class="operation-type">操作类</div>
                  <div class="operation-type-list" v-for="(child3, indx) in child2.OperationPermissionList" :key="child3.OperationPermissionName + indx">
                    <div class="operation-name" :class="child3.OperateDetails>0?'active':'no-active'">{{child3.OperationPermissionName}}</div>
                    <div v-if="child3.PermissionArr.length>0" class="f12" style="color:#DDDEE0;">
                      <span>来自：</span>
                      <span v-for="(child4, index4) in child3.PermissionArr" :key="child4">{{child4 + index4}}</span>
                      <!--操作类权限 二级-->
                      <div v-if="child3.OperChilds.length>0">
                        <div v-for="(child4, indxs) in child3.OperChilds" :key="child4 + indxs">
                          <div class="operation-name" :class="child4.OperateDetail>0?'active':'no-active'" v-if="child4.PermissionArr != null">{{child4.OperationPermissionName}}</div>
                          <div v-if="child4.PermissionArr.length>0" class="f12" style="color:#DDDEE0;">
                            <span>来自：</span>
                            <span v-for="(child5, index5) in child4.PermissionArr" :key="child5 + index5">{{child5}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  export default {
    name: 'UserPermissionView',
    data: function () {
      return {
        permissionList: [],
        userModel: null
      }
    },
    created () {
      this.userModel = JSON.parse(this.$route.query.row)
      this.getAllPermissAndMenu(this.userModel.UserId)
    },
    mounted () {
    },
    methods: {
      async getAllPermissAndMenu (id) {
        let params = {
          userID: id
        }
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/UserPermission/GetAllPermissAndMenu`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.permissionList = res.data
        } else {
          this.xy.msgError(res.msg)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .permissiong-box {
    box-shadow: 0px 4px 14px 0px rgba(189, 189, 189, 0.5);
    border-radius: 4px;
    margin-bottom: 20px;
  }
  .permissiong-box-content {
    padding: 10px;
  }
  .permissiong-box-title {
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 4px 4px 0px 0px;
    color: #3479cd;
    background: rgba(65, 150, 255, 0.1);
  }
  .permissiong-box-content-title {
    font-size: 16px;
    color: #333;
    width: 160px;
  }
  .child-list {
    display: flex;
    margin-bottom: 20px;
  }
  .child-flex {
    flex: 1;
  }
  .child-flex > div {
    margin-right: 15px;
    width: 160px;
  }
  .child2-name {
    color: #444;
  }
  .operation-type {
    color: #999;
    font-size: 12px;
    margin-bottom: 5px;
    font-weight: 700;
  }
  .operation-name.active {
    color: #4196ff;
    padding: 2px 5px;
    background: rgba(65, 150, 255, 0.1);
    display: inline-block;
    border-radius: 4px;
  }
  .operation-type-list {
    margin-bottom: 5px;
  }
  .fl {
    float: left;
    button {
      margin-right: .5em;
    }
  }
  .fr {
    float: right;
  }
  .pr {
    position: relative;
  }
  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
</style>
