<!-- 考试管理header按钮-赋分管理 -->
<template>
  <div class="xy-content-module">
    <!-- 赋分管理 -->
    <div class="xy-content-body">
      <div class="container">
        <div class="box">
          <div class="box-type new-box" @click="newMould">
            <Icon type="md-add"></Icon>
            <p>新增赋分方案</p>
          </div>
        </div>
        <div class="box" v-show="rowList.length > 0" v-for="item in rowList" :key="item.ID">
          <div class="box-type">
            <div class="box-tp">
              <div class="box-head">
                <i></i>
              </div>
              <div class="title-box">
                <p v-text="item.Name"></p>
                <div class="assign-points" v-if="item.Mode === 2">
                  赋分模式:
                  <div class="math-moudle">
                    <div class="math-left">
                      <span>x1-x</span>
                      <span>x-x2</span>
                    </div>
                    <span>=</span>
                    <div class="math-right">
                      <span>y1-y</span>
                      <span>y-y2</span>
                    </div>
                  </div>
                </div>
                <p v-if="item.Mode === 1">赋分模式：按比例</p>
              </div>
            </div>
            <div class="box-bt" v-if="!item.IsDefault">
              <div class="bt-group">
                <div class="bt-icon btn-noty">
                  <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink">
                    <!-- Generator: Sketch 58 (84663) - https://sketch.com -->
                    <title>编辑</title>
                    <desc>Created with Sketch.</desc>
                    <g id="svg-notify" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.45">
                      <g id="成绩档案-赋分管理" transform="translate(-390.000000, -298.000000)">
                        <g id="编组-13" transform="translate(365.000000, 146.000000)">
                          <g id="编组-9">
                            <g id="Group-129" transform="translate(25.000000, 152.000000)">
                              <rect id="Rectangle-44" x="0" y="0" width="15" height="15"></rect>
                              <g id="edit" transform="translate(0.937500, 0.937500)" fill="#000000" fill-rule="nonzero">
                                <path
                                  d="M12.5976562,12.0703125 L0.52734375,12.0703125 C0.235839844,12.0703125 0,12.3061523 0,12.5976562 C0,12.8891602 0.235839844,13.125 0.52734375,13.125 L12.5976562,13.125 C12.8891602,13.125 13.125,12.8891602 13.125,12.5976562 C13.125,12.3061523 12.8891602,12.0703125 12.5976562,12.0703125 Z M3.3984375,10.3417969 L6.84814453,8.88134766 C6.90380859,8.85791016 6.95361328,8.82421875 6.99755859,8.78173828 L12.815918,2.96337891 C13.2275391,2.55175781 13.2304688,1.88085938 12.8188477,1.46923828 L11.6572266,0.307617188 C11.2456055,-0.104003906 10.574707,-0.101074219 10.1630859,0.310546875 L4.34472656,6.12890625 C4.30224609,6.17138672 4.26855469,6.22265625 4.24511719,6.27832031 L2.78320312,9.7265625 C2.70117188,9.91992188 2.75830078,10.1147461 2.8828125,10.2407227 C3.00732422,10.3666992 3.20361328,10.4238281 3.3984375,10.3417969 Z M10.9086914,1.05615234 L10.9116211,1.05322266 L12.0717773,2.21337891 L12.0688477,2.21630859 L11.1606445,3.12451172 L10.0004883,1.96435547 L10.9086914,1.05615234 Z M5.17089844,6.79394531 L9.25488281,2.70996094 L10.4150391,3.87011719 L6.33105469,7.95410156 L4.31835937,8.80664062 L5.17089844,6.79394531 Z"
                                  id="Shape"></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                  <Button @click="okOpen(item)" class="bt-cl">编辑</Button>
                </div>
                <span></span>
                <div class="bt-icon dele-bt">
                  <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink">
                    <!-- Generator: Sketch 58 (84663) - https://sketch.com -->
                    <title>删除</title>
                    <desc>Created with Sketch.</desc>
                    <g id="svg-dele" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.45">
                      <g id="成绩档案-赋分管理" transform="translate(-494.000000, -299.000000)">
                        <g id="编组-13" transform="translate(365.000000, 146.000000)">
                          <g id="编组-9">
                            <g id="Group-185" transform="translate(128.000000, 152.000000)">
                              <rect id="Rectangle-48-Copy-13" x="0" y="0" width="16" height="16"></rect>
                              <g id="delete" transform="translate(0.984375, 1.015625)" fill="#000000" fill-rule="nonzero">
                                <path
                                  d="M1.84664308,13.842981 C1.81350698,13.8152032 1.77977918,13.7790921 1.74664308,13.742981 C1.78332946,13.7790921 1.81350698,13.8152032 1.84664308,13.842981 Z M1.69558106,13.7575317 C1.66135884,13.7253639 1.62758106,13.6931961 1.59558106,13.6575317 C1.6271366,13.6931961 1.66135884,13.7253639 1.69558106,13.7575317 Z M13.8654785,2.16308594 C13.7592773,2.05688477 13.6048584,1.99768066 13.4550171,1.99768066 L10.5741577,1.99768066 L10.5741577,1.10015869 C10.5741577,0.493164062 10.0809937,0 9.47399903,0 L4.55639648,0 C3.94940186,0 3.4562378,0.493164062 3.4562378,1.10015869 L3.4562378,1.99768066 L0.560729984,1.99768067 C0.253417969,1.99768067 0.001953125,2.24731447 0.001953125,2.55645753 C0.001953125,2.86560059 0.251586922,3.11523439 0.560729984,3.11523439 L1.05389405,3.11523439 L1.05389405,12.8396607 C1.05389405,13.4466553 1.54705811,13.9398193 2.15405273,13.9398193 L12.0332031,13.9398193 C12.6401977,13.9398193 13.1333618,13.4466553 13.1333618,12.8396607 L13.1333618,3.11523438 L13.4547119,3.11523438 C13.7620239,3.11523438 14.0290539,2.86560058 14.0290539,2.55645752 C14.0293579,2.40814209 13.9716797,2.26928711 13.8654785,2.16308594 Z M4.55456544,1.10351562 L9.46911622,1.10351562 L9.46911622,2.00714111 L4.55456544,2.00714111 L4.55456544,1.10351562 Z M12.0316773,12.8381348 L2.15405273,12.8381348 L2.15405273,3.11523438 L3.57739258,3.11523438 L12.0313721,3.11523438 L12.0313721,12.8381348 L12.0316773,12.8381348 Z M7.00787353,4.98779297 C6.69720458,4.98779297 6.44604492,5.23895264 6.44604492,5.54962158 L6.44604492,10.7623291 C6.44604492,11.072998 6.69720459,11.3241577 7.00787353,11.3241577 C7.31854247,11.3241577 7.56970216,11.072998 7.56970216,10.7623291 L7.56970216,5.54962158 C7.56970216,5.23925781 7.31854248,4.98779297 7.00787353,4.98779297 Z M3.96466064,4.98779297 C3.65399169,4.98779297 3.40283203,5.23895264 3.40283203,5.54962158 L3.40283203,10.7623291 C3.40283203,11.072998 3.6539917,11.3241577 3.96466064,11.3241577 C4.27532958,11.3241577 4.52648927,11.072998 4.52648927,10.7623291 L4.52648927,5.54962158 C4.52648927,5.23925781 4.27502442,4.98779297 3.96466064,4.98779297 Z M10.0199585,4.98779297 C9.70928955,4.98779297 9.45812989,5.23895264 9.45812989,5.54962158 L9.45812989,10.7623291 C9.45812989,11.072998 9.70928956,11.3241577 10.0199585,11.3241577 C10.3306274,11.3241577 10.5817871,11.072998 10.5817871,10.7623291 L10.5817871,5.54962158 C10.5817871,5.23925781 10.3306274,4.98779297 10.0199585,4.98779297 Z"
                                  id="Shape"></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                  <!-- <img src="XYSubSiteLinkUrl/View/eaAR/AssignmentScoreManage/PC/Image/notify.svg" /> -->
                  <Button @click="deleteData(item)">删除</Button>
                </div>
                <span></span>
                <div class="bt-icon set-dt">
                  <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink">
                    <!-- Generator: Sketch 58 (84663) - https://sketch.com -->
                    <title>设置</title>
                    <desc>Created with Sketch.</desc>
                    <g id="svg-setting" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.45">
                      <g id="成绩档案-赋分管理" transform="translate(-597.000000, -298.000000)">
                        <g id="编组-13" transform="translate(365.000000, 146.000000)">
                          <g id="编组-9">
                            <g id="Group-121" transform="translate(232.000000, 152.000000)">
                              <rect id="Rectangle-43-Copy-8" x="0" y="0" width="16" height="16"></rect>
                              <g id="setting" transform="translate(0.875000, 0.859375)" fill="#000000"
                                fill-rule="nonzero">
                                <path
                                  d="M14.153125,6.009375 L14.09375,5.634375 L12.9484375,5.2515625 C12.8484375,4.9421875 12.7234375,4.6390625 12.575,4.35 L13.115625,3.2703125 L12.89375,2.9609375 C12.44375,2.346875 11.90625,1.809375 11.2953125,1.365625 L10.9875,1.14375 L9.9078125,1.684375 C9.6171875,1.5359375 9.315625,1.4109375 9.00625,1.3109375 L8.625,0.16875 L8.253125,0.1109375 C7.8390625,0.0453125 7.48125,0.0140625 7.125,0.0140625 C6.778125,0.0140625 6.41875,0.0453125 5.9953125,0.1125 L5.6203125,0.171875 L5.2390625,1.31875 C4.9234375,1.421875 4.6203125,1.546875 4.3375,1.690625 L3.259375,1.1484375 L2.9515625,1.3703125 C2.3390625,1.8140625 1.8015625,2.35 1.3546875,2.965625 L1.1328125,3.275 L1.6734375,4.3546875 C1.5265625,4.64375 1.4015625,4.9453125 1.3015625,5.2546875 L0.15625,5.634375 L0.096875,6.009375 C0.03125,6.4234375 0,6.7921875 0,7.140625 C0,7.490625 0.03125,7.859375 0.096875,8.2703125 L0.15625,8.6453125 L1.3015625,9.028125 C1.4015625,9.3375 1.5265625,9.640625 1.675,9.9296875 L1.1375,11.00625 L1.359375,11.3125 C1.590625,11.634375 1.8296875,11.9171875 2.0890625,12.178125 C2.33125,12.421875 2.6140625,12.6609375 2.953125,12.909375 L3.2609375,13.13125 L4.3390625,12.590625 C4.6296875,12.7390625 4.93125,12.865625 5.240625,12.9640625 L5.621875,14.1109375 L5.996875,14.1703125 C6.4078125,14.2359375 6.7765625,14.2671875 7.125,14.2671875 C7.4734375,14.2671875 7.8421875,14.2359375 8.2546875,14.1703125 L8.6296875,14.1109375 L9.0109375,12.9640625 C9.3171875,12.8640625 9.61875,12.7390625 9.9109375,12.5921875 L10.990625,13.1328125 L11.2984375,12.9109375 C11.634375,12.66875 11.9171875,12.4296875 12.1625,12.1796875 C12.4171875,11.925 12.6546875,11.640625 12.8921875,11.3140625 L13.1140625,11.0046875 L12.5734375,9.925 C12.721875,9.6359375 12.846875,9.334375 12.946875,9.0234375 L14.0921875,8.640625 L14.1515625,8.265625 C14.2171875,7.8546875 14.2484375,7.4859375 14.2484375,7.1375 C14.253125,6.7921875 14.221875,6.421875 14.153125,6.009375 Z M13.1296875,7.128125 L13.1296875,7.1359375 C13.1296875,7.346875 13.115625,7.5609375 13.0890625,7.790625 L12.5359375,7.975 L12.046875,8.140625 L11.8953125,8.6328125 C11.809375,8.9171875 11.6953125,9.19375 11.55625,9.45625 L11.315625,9.9109375 L11.80625,10.890625 C11.6625,11.071875 11.5203125,11.2328125 11.371875,11.38125 L11.36875,11.384375 C11.2234375,11.53125 11.0625,11.6734375 10.88125,11.815625 L9.9046875,11.3265625 L9.4515625,11.5625 C9.184375,11.7015625 8.903125,11.8171875 8.6171875,11.9078125 L8.128125,12.0609375 L7.96875,12.5453125 L7.784375,13.0984375 C7.55625,13.1265625 7.340625,13.1390625 7.1296875,13.1390625 C6.9203125,13.1390625 6.7046875,13.125 6.475,13.0984375 L6.290625,12.5453125 L6.1296875,12.05625 L5.6375,11.9046875 C5.346875,11.815625 5.0703125,11.7015625 4.8140625,11.565625 L4.3578125,11.328125 L3.896875,11.5578125 L3.3765625,11.8171875 C3.1953125,11.6734375 3.034375,11.53125 2.8859375,11.3828125 C2.734375,11.23125 2.5921875,11.0703125 2.4515625,10.8921875 L2.9390625,9.915625 L2.7015625,9.4625 C2.559375,9.190625 2.44375,8.9125 2.359375,8.634375 L2.2078125,8.1421875 L1.1671875,7.796875 C1.1390625,7.56875 1.1265625,7.353125 1.1265625,7.1421875 C1.1265625,6.93125 1.140625,6.7171875 1.1671875,6.4875 L2.2046875,6.1421875 L2.35625,5.6515625 C2.44375,5.36875 2.559375,5.0890625 2.6984375,4.8203125 L2.9359375,4.3671875 L2.7078125,3.909375 L2.4484375,3.3890625 C2.721875,3.0484375 3.0328125,2.7375 3.3734375,2.4640625 L4.3515625,2.953125 L4.80625,2.7140625 C5.06875,2.5765625 5.3484375,2.4609375 5.6375,2.3703125 L6.1265625,2.2171875 L6.2890625,1.73125 L6.4734375,1.178125 C6.709375,1.1515625 6.9234375,1.1375 7.1265625,1.1375 C7.3359375,1.1375 7.5515625,1.1515625 7.7796875,1.178125 L8.1265625,2.2140625 L8.615625,2.365625 C8.9,2.4546875 9.1796875,2.5703125 9.446875,2.7078125 L9.9,2.9453125 L10.8765625,2.45625 C11.2171875,2.7296875 11.5296875,3.040625 11.80625,3.3828125 L11.31875,4.359375 L11.553125,4.8109375 C11.6921875,5.0796875 11.809375,5.3609375 11.8984375,5.646875 L12.0515625,6.1359375 L12.5375,6.2984375 L13.090625,6.4828125 C13.1203125,6.7171875 13.1328125,6.928125 13.1296875,7.128125 Z M7.128125,4.4171875 C5.6265625,4.4171875 4.4046875,5.6390625 4.4046875,7.140625 C4.4046875,8.6421875 5.6265625,9.8640625 7.128125,9.8640625 C8.6296875,9.8640625 9.8515625,8.6421875 9.8515625,7.140625 C9.8515625,5.6390625 8.6296875,4.4171875 7.128125,4.4171875 Z M8.2578125,8.2703125 C7.95625,8.571875 7.5546875,8.7390625 7.128125,8.7390625 C6.7015625,8.7390625 6.3,8.5734375 5.9984375,8.2703125 C5.696875,7.96875 5.5296875,7.5671875 5.5296875,7.140625 C5.5296875,6.7140625 5.6953125,6.3125 5.9984375,6.0109375 C6.3,5.709375 6.7015625,5.5421875 7.128125,5.5421875 C7.5546875,5.5421875 7.95625,5.7078125 8.2578125,6.0109375 C8.559375,6.3140625 8.7265625,6.7140625 8.7265625,7.140625 C8.7265625,7.5671875 8.559375,7.96875 8.2578125,8.2703125 Z"
                                  id="Shape"></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                  <Button @click="setData(item)" class="bt-cl">设置</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 新增或编辑方案 -->
      <Modal v-model="modal"
            :title="title"
            :mask-closable="false"
            :closable="false"
            :loading="loadingType">
        <div class="dialog-model-content">
          <Form ref="formRef" :model="formData" :rules="ruleValidate" :label-width="100" @submit.native.prevent>
            <form-item label="方案名称：" prop="Name" label-for="Name">
              <Input v-model="formData.Name" element-id="Name" placeholder="请输入赋分方案名称" />
            </form-item>
            <form-item label="赋分模式：" prop="Mode">
              <radio-group v-model="formData.Mode" class="xy-flex">
                <Radio :label="2" class="x-y-mod" :disabled="title === '编辑赋分方案'">
                  <div class="math-moudle">
                    <div class="math-left">
                      <span>x1-x</span>
                      <span>x-x2</span>
                    </div>
                    <span>=</span>
                    <div class="math-right">
                      <span>y1-y</span>
                      <span>y-y2</span>
                    </div>
                  </div>
                </Radio>
                <Radio :label="1" :disabled="title === '编辑赋分方案'">按比例</Radio>
              </radio-group>
            </form-item>
          </Form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancelEditType">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="editType">保存</Button>
        </div>
      </Modal>

      <!-- 赋分设置 -->
      <Modal v-model="assign"
          :title="'设置'+setTitle"
          :mask-closable="false"
          :closable="false"
          :loading="loadingType"
          width="900">
        <div class="dialog-model-content">
          <p v-if="math === 1" class="order-rank">根据学生排名，按比例赋相对应的分数。</p>
          <div class="remark" v-if="math === 2">
            <div class="math-moudle">
              <div class="math-left">
                <span>x1-x</span>
                <span>x-x2</span>
              </div>
              <span>=</span>
              <div class="math-right">
                <span>y1-y</span>
                <span>y-y2</span>
              </div>
            </div>
            <p>x为原始分，x1为某等级上限原始分，x2为某等级下限原始分；y为等级分，y1为某等级上限等级分，y2为某等级下限等级分。</p>
          </div>
          <Table :columns="headList" :data="resData"></Table>
          <div class="add-gp" @click="addRow"><!-- math:1按比例 2公式 -->
            <Icon type="md-add"></Icon>
            添加
          </div>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="assign=false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="submitTable">保存</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AssignmentScoreManage',
    components: {
    },
    data () {
      return {
        rowList: [],
        modal: false,
        loadingType: false,
        formData: {
          Name: '',
          Mode: 2
        },
        updata: null,
        title: '',
        titles: '',
        ruleValidate: {
          Name: [
            {
              required: true,
              message: '赋分方案名称不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 15,
              message: '名称最多允许15个字符',
              trigger: 'blur'
            }
          ],
          Mode: [
            {
              required: true
              // message: '公文类型不能为空！',
              // trigger: 'blur'
            }
          ]
        }, // 表单校验规则
        assign: false,
        resData: [],
        headList: [
          {
            title: '等级',
            key: 'FuFenPatternDetailName',
            render: (h, params) => {
              return h('input', {
                attrs: {
                  // 图片需放在static文件夹下
                  // src: '../../../static/img/calibration-tip.svg'
                  value: params.row.FuFenPatternDetailName,
                  maxLength: 5,
                  placeholder: '请输入等级名称',
                  id: 'FuFenPatternDetailName' + params.row.onlyId
                },
                style: {
                  // marginBottom: '3px'
                  borderRadius: '4px',
                  border: '1px solid rgba(217,217,217,1)',
                  height: '32px',
                  width: '100px',
                  padding: '.5em'
                },
                on: {
                  blur: () => {
                    this.updateInputValue()
                  }
                }
              })
            }
          },
          {
            title: '人数比例',
            key: 'NumPercentage',
            render: (h, params) => {
              return h('div', [
                h('input', {
                  attrs: {
                    // 图片需放在static文件夹下
                    // src: '../../../static/img/calibration-tip.svg'
                    value: params.row.NumPercentage,
                    id: 'NumPercentage' + params.row.onlyId
                  },
                  style: {
                    // marginBottom: '3px'
                    borderRadius: '4px',
                    border: '1px solid rgba(217,217,217,1)',
                    height: '32px',
                    width: '70px',
                    padding: '.5em',
                    textAlign: 'center'
                  },
                  on: {
                    blur: () => {
                      this.updateInputValue()
                    }
                  }
                }),
                h('span', {
                  style: {
                    marginLeft: '5px',
                    textAlign: 'center'
                  }
                }, '%')
              ])
            }
          },
          {
            title: '赋分',
            key: 'address',
            render: (h, params) => {
              return h('div', [
                h('input', {
                  attrs: {
                    // 图片需放在static文件夹下
                    // src: '../../../static/img/calibration-tip.svg'
                    value: params.row.MaxScore,
                    maxLength: 3,
                    id: 'MaxScore' + params.row.onlyId
                  },
                  style: {
                    // marginBottom: '3px'
                    borderRadius: '4px',
                    border: '1px solid rgba(217,217,217,1)',
                    height: '32px',
                    width: '60px',
                    padding: '.5em',
                    textAlign: 'center'
                  },
                  on: {
                    blur: () => {
                      this.updateInputValue()
                    }
                  }
                }),
                params.row.Mode === 2 ? h('span', {
                  style: {
                    margin: ' 3px',
                    textAlign: 'center'
                  }
                }, '-') : '',
                params.row.Mode === 2 ? h('input', {
                  attrs: {
                    // 图片需放在static文件夹下
                    // src: '../../../static/img/calibration-tip.svg'
                    value: params.row.MinScore,
                    maxLength: 3,
                    id: 'MinScore' + +params.row.onlyId
                  },
                  style: {
                    // marginBottom: '3px'
                    borderRadius: '4px',
                    border: '1px solid rgba(217,217,217,1)',
                    height: '32px',
                    width: '60px',
                    padding: '.5em',
                    textAlign: 'center'
                  },
                  on: {
                    blur: () => {
                      this.updateInputValue()
                    }
                  }
                }) : ''
              ])
            }
          },
          {
            title: ' ',
            render: (h, params) => {
              return params.row.lastRow ? h('div', [
                h('icon', {
                  attrs: {
                    type: 'ios-trash-outline',
                    custom: 'dele-hover'
                  },
                  style: {
                    fontSize: '20px'
                  },
                  on: {
                    click: () => {
                      // console.log(params.index ? 1 : 2)
                      // console.log(params)
                      this.deleteRwo()
                    }
                  }
                })
              ]) : ''
            }

          }
        ],
        math: 0,
        FuFenPatternID: null,
        cont: 0,
        setTitle: ''
      }
    },
    created () {
      this.GetAll()
      this.changeLoading()
    },
    mounted () {
    },
    methods: {
      // 为了解决，input框输入值后value没有动态更新的问题
      updateInputValue () {
        this.cont = 0
        for (var item in this.resData) {
          this.resData[item].FuFenPatternDetailName = document.getElementById('FuFenPatternDetailName' + this.resData[item].onlyId).value
          this.resData[item].NumPercentage = document.getElementById('NumPercentage' + this.resData[item].onlyId).value * 1
          this.resData[item].MaxScore = document.getElementById('MaxScore' + this.resData[item].onlyId).value * 1
          if (this.math === 2) {
            this.resData[item].MinScore = document.getElementById('MinScore' + this.resData[item].onlyId).value * 1
          } else {
            this.resData[item].MinScore = 0
          }
          this.cont += document.getElementById('NumPercentage' + this.resData[item].onlyId).value * 1
        }
      },
      // 提交前进行表单验证
      validTable () {
        this.changeLoading()
        if (this.resData.length === 0) { this.xy.msgError('没有可提交的数据。'); return false }
        // if (this.resData.length > 1) {
        var arr = this.resData.map(function (val) { return val.FuFenPatternDetailName }).sort()
        for (var i in arr) {
          if (!arr[i].trim()) { this.xy.msgError('等级名称不能为空。'); return false }
          if (i * 1 < arr.length - 1) {
            if (arr[i] === arr[i * 1 + 1]) {
              this.xy.msgError('等级名称重复。')
              return false
            }
          }
        }
        // }
        // console.log(this.resData)
        for (var item in this.resData) {
          if (this.resData[item].NumPercentage === 0 || !this.resData[item].NumPercentage.toString().trim()) {
            this.xy.msgError('人数比例不能为空且必须为大于0的整数。')
            return false
          }
          if (this.resData[item].MaxScore === 0 || !this.resData[item].MaxScore.toString().trim()) {
            this.xy.msgError('赋分不能为空且必须为大于0的整数。')
            return false
          }
          if (!(/(^[0-9]\d*$)/.test(this.resData[item].NumPercentage)) || !(/(^[0-9]\d*$)/.test(this.resData[item].MaxScore)) || !(/(^[0-9]\d*$)/.test(this.resData[item].MinScore))) {
            this.xy.msgError('请输入大于0的整数。')
            return false
          }
          if (this.math === 2) {
            if (this.resData[item].MinScore === 0 || !this.resData[item].MinScore.toString().trim()) {
              this.xy.msgError('赋分不能为空且必须为大于0的整数。')
              return false
            }
            if (this.resData[item].MinScore >= this.resData[item].MaxScore) {
              this.xy.msgError('赋分区间分数不能有交叉，下一等级开始分段只能小于上一等级结束分段。')
              return false
            }
            if (item < this.resData.length - 1) {
              if (this.resData[item * 1 + 1].MaxScore >= this.resData[item].MinScore) {
                this.xy.msgError('赋分区间分数不能有交叉，下一等级开始分段只能小于上一等级结束分段。')
                return false
              }
            }
          }
        }
        if (this.cont > 100) { this.xy.msgError('人数比例总和不能超过100。'); return false };
        return true
      },
      // 插入一行
      addRow () {
        this.updateInputValue()
        if (!this.validTable()) return
        if (this.resData[this.resData.length - 1].lastRow) {
          this.resData[this.resData.length - 1].lastRow = false
        }
        // math:1按比例 2公式
        this.resData.push({
          FuFenPatternDetailID: 0,
          FuFenPatternDetailName: '',
          NumPercentage: 100 - this.cont,
          // MaxScore: this.math === 2 ? this.resData[this.resData.length - 1].MinScore - 1 : this.resData[this.resData.length - 1].MaxScore - 1,
          MaxScore: this.math === 2 ? this.resData[this.resData.length - 1].MinScore - 1 : 0,
          // MinScore: this.math === 2 ? this.resData[this.resData.length - 1].MinScore - 15 : 0,
          MinScore: this.math === 2 ? (this.resData[this.resData.length - 1].MinScore - 15 >= 0 ? this.resData[this.resData.length - 1].MinScore - 15 : 0) : 0,
          lastRow: true,
          Mode: this.math,
          onlyId: new Date().getTime() + Math.floor(Math.random() * (1 - 1000) + 1000)
        })
      },
      // 删除最后一行
      deleteRwo () {
        var that = this
        that.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除该行吗？</p>',
          onOk () {
            that.resData.pop()
            if (that.resData.length > 1) {
              that.updateInputValue()
              that.resData[that.resData.length - 1].lastRow = true
            }
          }
        })
      },
      // 新建
      newMould () {
        this.$refs.formRef.resetFields()
        this.modal = true
        this.title = '新增赋分方案'
        this.formData.Name = ''
        this.formData.Mode = 2
        this.updata = ''
      },
      // 编辑
      okOpen (val) {
        this.modal = true
        this.formData.Name = val.Name
        this.formData.Mode = val.Mode
        this.updata = val
        this.title = '编辑赋分方案'
      },
      // modeChange (val) {
      //   this.formData.Mode = val
      //   this.$refs.formRef.resetFields()
      // },
      // 取消
      cancelEditType () {
        this.$refs.formRef.resetFields()
        this.modal = false
      },
      // 新增，编辑
      editType () {
        this.changeLoading()
        var that = this
        that.$refs.formRef.validate(function (valid) {
          if (valid) {
            that.xy.loading()
            // 编辑
            if (that.updata) {
              that.editFun()
            } else {
              // 新增
              that.creatFun()
            }
          }
        })
      },
      async editFun () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecordFufenPattern/Update`, {
          ID: this.updata.ID,
          Name: this.formData.Name
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg)
          this.GetAll()
          this.modal = false
          this.updata = null
        }
      },
      async creatFun () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecordFufenPattern/Create`, {
          Name: this.formData.Name,
          Mode: this.formData.Mode
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg)
          this.GetAll()
          this.modal = false
        }
      },
      // 删除
      deleteData (row) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除"' + row.Name + '"吗？</p>',
          onOk: () => {
            this.xy.loading()
            this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecordFufenPattern/Delete?ID=${row.ID}`).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.xy.msgSuc(res.msg)
                this.GetAll()
              }
            })
          }
        })
      },
      // 成绩档案-赋分管理（设置）-查询详细子项列表
      async GetByfuFenPatternID () {
        var that = this
        that.xy.loading()
        let res = await that.xy.get(`${that.$store.state.apiPath}/api/AchievementRecordFufenPatternDetail/GetByfuFenPatternID`, {
          FuFenPatternID: that.FuFenPatternID
        })
        that.xy.unloading()
        if (res.success) {
          // that.resData = [];
          if (res.data && res.data.length > 0) {
            that.resData = res.data.map(function (val, index) {
              return {
                FuFenPatternDetailID: val.FuFenPatternDetailID, // 子项ID(有值赋值，没有值赋0)
                FuFenPatternDetailName: val.FuFenPatternDetailName, // 等级名字
                NumPercentage: val.NumPercentage, // 百分比
                MaxScore: val.MaxScore, // 最大值
                MinScore: that.math === 2 ? val.MinScore : 0, // 最小值(比例模式的赋值0)
                lastRow: !!((index !== 0 && index === res.data.length - 1)),
                Mode: that.math,
                onlyId: new Date().getTime() + Math.floor(Math.random() * (1 - 1000) + 1000)
              }
            })
          } else {
            that.resData = [{
              FuFenPatternDetailID: 0,
              FuFenPatternDetailName: '',
              NumPercentage: 0,
              MaxScore: 0,
              MinScore: 0,
              lastRow: false,
              Mode: that.math,
              onlyId: new Date().getTime() + Math.floor(Math.random() * (1 - 1000) + 1000)
            }]
            // that.updateInputValue()
          }
        }
      },
      // 设置
      setData (val) {
        this.assign = true
        this.math = val.Mode
        this.setTitle = val.Name
        this.FuFenPatternID = val.ID
        this.resData = []
        this.GetByfuFenPatternID()
        this.updateInputValue()
      },
      // 提交table
      async submitTable () {
        if (!this.validTable()) return
        var that = this
        var option = this.resData.map(function (val) {
          return {
            FuFenPatternDetailID: val.FuFenPatternDetailID || 0, // 子项ID(有值赋值，没有值赋0)
            FuFenPatternDetailName: val.FuFenPatternDetailName, // 等级名字
            NumPercentage: val.NumPercentage, // 百分比
            MaxScore: val.MaxScore, // 最大值
            MinScore: that.math === 2 ? val.MinScore : 0 // 最小值(比例模式的赋值0)
          }
        })
        let res = await that.xy.post(`${that.$store.state.apiPath}/api/AchievementRecordFufenPatternDetail/Save`, {
          Options: option,
          FuFenPatternID: that.FuFenPatternID
        })
        // this.xy.unloading()
        if (res.success) {
          that.assign = false
          that.resData = []
          this.xy.msgSuc(res.msg)
          that.GetAll()
        }
      },
      changeLoading () {
        this.loadingType = false
        this.$nextTick(function () {
          this.loadingType = true
        })
      },
      // 查询列表
      async GetAll () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AchievementRecordFufenPattern/GetAll`)
        this.xy.unloading()
        if (res.success) {
          if (res.data && res.data.length > 0) {
            // this.total = res.data.totalRecords
            this.rowList = res.data
          } else {
            this.rowList = []
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>

.container {
  display: flex;
  /* justify-content: space-between; */
  padding: 20px 0;
  flex-flow: row wrap;
}
.xy-content-title {
  margin-bottom: 0;
}
.box {
  width: 310px;
  height: 194px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box-type {
  width: 296px;
  height: 181px;
  background:rgba(255,255,255,1);
  border:1px solid #D9D9D9;
  border-radius:2px;
  font-size: 14px;
}
.new-box {
  border:1px dashed #D9D9D9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: rgba(0,0,0,0.45);
  cursor: pointer;
}
.box-type:nth-of-type(1) i {
  font-size: 20px;
}
.box-type .box-tp {
  height: 71.667%;
  /* color: rgba(0,0,0,0.45); */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-type .box-head {
  display: flex;
  flex: .2;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.box-type .box-tp i {
  display: flex;
  width:48px;
  height:48px;
  background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAARVBMVEVHcEz/wQD/mQD/vwD/vwD/vwD/wAD/wAD/wQD/xAD/wAD/vwD/wAD/vwD/vwD/+/H/4IP/22//yCT/9Nb/56H/0kz/xBU/BmZVAAAADnRSTlMAJAXb+lPO8W0Vjci2j98baLcAAAE9SURBVEjHpZbZsoQgDERRwYBLxIX5/08dZ/TekkBYavrR6qO2xAYhqIyapw6khG6alREZGT3iRxJvjTrFmAEwEAwc0uqI/YvoNuZvemTVN6FfASYEivq1xKSkJn7MySeUxDzxeKsGsEDwn7ztsUh9Wxzg1h3DQCkA15oPWKwhfICzlxz/CC+BW/5k2RTj84Jd0sR4vhFSYD8ShBGKAgfiehFrBFBipsB5421hiVlMFNjddiwsMYkOmdBxohOQBAIChD/Y65IhJAHwyBBS0MlLExJI6CjhvNATZonV+6xzuDjkU+2bt3AqBF6W9Z+jYWIjZjn/OXz+eAcE8Y9sBdio//sDMR1gY/6rBZgSsKH/KgG2Ztz6itdMdZHVV2V1GdfXfVEM/duWVb8p1m+79Rv7SVQeHZ6HEyw7nJQcf95LBWQSOeNMDwAAAABJRU5ErkJggg==")no-repeat center;
  border-radius: 50%;
}
.box-type .box-tp .title-box {
  height: 50%;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-flow: column nowrap;
  flex: .78;
}
.box-type .box-tp .title-box p:nth-of-type(1) {
  font-weight:500;
  color:rgba(0,0,0,0.85);
  font-size: 16px;
}
.box-type .box-tp .title-box p:nth-of-type(2) {
  font-size: 14px;
  color:rgba(0,0,0,0.45);
}
.box-type .box-tp .title-box .assign-points {
  height: 50%;
  display: flex;
  color: rgba(0,0,0,0.45);
}
.math-moudle {
  position: relative;
  margin-left: 7px;
}
.x-y-mod > span {
  display: flex;
  align-items: center;
}
.x-y-mod .math-moudle {
  display: inline-block;
  position: relative;
  top: -8px;
  left: -3px;
}
.math-moudle > span {
  position: relative;
  top: 11px;
}
.math-moudle .math-left {
  position: relative;
  display: inline-block;
}
.math-moudle .math-left span, .math-right span {
  width: 40px;
  display: inline-block;
  display: flex;
  justify-content: center;
  align-items: center;
}
.math-moudle .math-left span:nth-of-type(1), .math-right span:nth-of-type(1) {
  height: 20px;
}
.math-moudle .math-left span:nth-of-type(2), .math-right span:nth-of-type(2) {
  height: 22px;
}
.math-moudle .math-left span:nth-of-type(2) {
  position: absolute;
  width: 40px;
  display: inline-block;
  text-align: center;
  border-top: 1px solid rgba(0,0,0,0.45);
  left: 0;
    top: 20px;
}
.math-moudle .math-right {
  position: relative;
  display: inline-block;
}
.math-moudle .math-right span:nth-of-type(2) {
  position: absolute;
  width: 40px;
  display: inline-block;
  text-align: center;
  border-top: 1px solid rgba(0,0,0,0.45);
  left: 0;
    top: 20px;
}
.box-type .box-tp .title-box p:nth-of-type(1) {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
}
.box-type > p:nth-of-type(2) {
  height: 30%;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  color: #999999;
}
.box-bt {
  width: 100%;
  height: 28.333%;
}
.bt-group {
  width: 100%;
  height: 100%;
  border-top: 1px solid #E9E9E9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(249,250,251,1);
}

.bt-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
.bt-icon {
  /* padding */
  flex: 1;
  cursor: pointer;
}
.bt-icon  button {
  /* width: 33%; */
  /* flex: 1; */
  height: 100%;
}
.bt-group > span {
  height: 16px;
  width: 1px;
  background-color: #E8E8E8;
}
.bt-icon .ivu-btn {
  border-radius: 0 0 2px 2px;
  background:rgba(249,250,251,1);
  border: 0px;
  color: #999;
  font-size: 14px;
  padding: 0 11px;
}
.bt-group .bt-icon svg {
  width: 13.5px;
  height: 13.5px;
}
.bt-group .bt-icon:hover {
  transition: 200ms;
  transition-timing-function: ease-in-out;
  -webkit-transition: 200ms;
  -webkit-transition-timing-function: ease-in-out;
}
.bt-group .bt-icon:hover svg #svg-notify, .bt-group .bt-icon:hover svg #svg-dele,.bt-group .bt-icon:hover svg #svg-setting  {
  opacity: 1;
}
.bt-group .btn-noty:hover svg #edit, .bt-group .set-dt:hover svg #setting {
  fill: #4196FF;
}
.bt-group .btn-noty:hover button, .bt-group .set-dt:hover button {
  color: #4196FF;
}
.bt-group .dele-bt:hover svg #delete {
  fill: #EA6666;
}
.bt-group .dele-bt:hover button {
  color: #EA6666;
}
.box-type .set-dt:hover {
  color: #4196FF;
}

.remark {
  display: flex;
  color:rgba(0,0,0,0.45);
}
.remark .math-moudle {
  height: 50px;
  flex: .12;
}
.remark > p {
  height: 50px;
  flex: .8;
}
.ivu-table th {
  background:rgba(250,250,250,1);
}
/* .ivu-table th, .ivu-table td {
  font-size: 14px;
} */
.dele-hover:hover {
  color: #EA6666;
  cursor: pointer;
}
.add-gp {
  color: #4196FF;
  font-size: 14px;
  padding: 10px;
  cursor: pointer;
  display: inline-block;
}
.add-gp i {
  font-size: 16px;
}
.order-rank {
  color:rgba(0,0,0,0.45);
  font-size: 12px;
}
</style>
