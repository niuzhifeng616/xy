const XyTableDemo = () => import (/* webpackChunkName: "common" */ '@/components/table/XyTableDemo.vue')
const SelectTeacherOrgDemo = () => import (/* webpackChunkName: "common" */ '@/components/selectTeacherOrg/SelectTeacherOrgDemo.vue')
const SelectStudentDemo = () => import (/* webpackChunkName: "common" */ '@/components/selectStudent/SelectStudentDemo.vue')
const SelectDutyAndRoleDemo = () => import (/* webpackChunkName: "common" */ '@/components/selectDutyAndRole/SelectDutyAndRoleDemo.vue')
const SelectClassRadioDemo = () => import (/* webpackChunkName: "common" */ '@/components/selectClassRadio/SelectClassRadioDemo.vue')
const SelectClassRoomDemo = () => import (/* webpackChunkName: "common" */ '@/components/selectClassRoom/SelectClassRoomDemo.vue')
const SelectClassesDemo = () => import (/* webpackChunkName: "common" */ '@/pages/csmsTimeTable/components/selectClasses/SelectClassesDemo.vue')
const UpfileDemo = () => import (/* webpackChunkName: "common" */ '@/components/upFile/XyUpfileDemo.vue')

const workflowDemo = () => import(/* webpackChunkName: "common" */ '@/components/workflow/WorkflowDemo.vue')
const workflowApplyDemo = () => import(/* webpackChunkName: "common" */ '@/components/workflow/WorkflowApplyDemo.vue')
const workflowApprovalDemo = () => import(/* webpackChunkName: "common" */ '@/components/workflow/WorkflowApprovalDemo.vue')
const editorDemo = () => import(/* webpackChunkName: "common" */ '@/components/editor/EditorDemo.vue')
const picDemo = () => import (/* webpackChunkName: "common" */ '@/components/pictureCropping/CropperDemo.vue')
const treeAntDemo = () => import (/* webpackChunkName: "common" */ '@/components/treeAnt/treeAntDemo.vue')
const upFileDemonew = () => import (/* webpackChunkName: "common" */ '@/components/upFileOptimize/upFileDemo.vue')

const demo = [
  {
    path: 'XyTableDemo',
    name: 'XyTableDemo',
    component: XyTableDemo
  },
  {
    path: 'SelectTeacherOrgDemo',
    name: 'SelectTeacherOrgDemo',
    component: SelectTeacherOrgDemo
  },
  {
    path: 'SelectStudentDemo',
    name: 'SelectStudentDemo',
    component: SelectStudentDemo
  },
  {
    path: 'SelectDutyAndRoleDemo',
    name: 'SelectDutyAndRoleDemo',
    component: SelectDutyAndRoleDemo
  },
  {
    path: 'SelectClassRadioDemo',
    name: 'SelectClassRadioDemo',
    component: SelectClassRadioDemo
  },
  {
    path: 'SelectClassRoomDemo',
    name: 'SelectClassRoomDemo',
    component: SelectClassRoomDemo
  },
  {
    path: 'SelectClassesDemo',
    name: 'SelectClassesDemo',
    component: SelectClassesDemo
  },
  {
    path: 'UpfileDemo',
    name: 'UpfileDemo',
    component: UpfileDemo
  },
  {
    path: 'workflowDemo',
    name: 'workflowDemo',
    component: workflowDemo
  },
  {
    path: 'workflowApplyDemo',
    name: 'workflowApplyDemo',
    component: workflowApplyDemo
  },
  {
    path: 'workflowApprovalDemo',
    name: 'workflowApprovalDemo',
    component: workflowApprovalDemo
  },
  {
    path: 'editorDemo',
    name: 'editorDemo',
    component: editorDemo
  },
  {
    path: 'picDemo',
    name: 'picDemo',
    component: picDemo
  },
  {
    path: 'treeAntDemo',
    name: 'treeAntDemo',
    component: treeAntDemo
  },
  {
    path: 'upFileDemonew',
    name: 'upFileDemonew',
    component: upFileDemonew
  }
]
export default demo
