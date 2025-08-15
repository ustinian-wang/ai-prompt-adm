import{m as o}from"./vendor-9a0f791b.js";import{n}from"./index-7809c99c.js";import"./antd-9085d354.js";const l={name:"Login",data(){return{loading:!1,registerVisible:!1,registerLoading:!1}},beforeCreate(){this.form=this.$form.createForm(this),this.registerForm=this.$form.createForm(this)},methods:{...o("user",["login"]),async handleSubmit(s){s.preventDefault(),this.loading=!0;try{const r=await new Promise((e,a)=>{this.form.validateFields((t,i)=>{t?a(t):e(i)})});await this.login(r),this.$message.success("登录成功"),this.$router.push("/")}catch(r){this.$message.error(r.message||"登录失败")}finally{this.loading=!1}},showRegister(){this.registerVisible=!0},async handleRegister(){try{const s=await new Promise((r,e)=>{this.registerForm.validateFields((a,t)=>{a?e(a):r(t)})});this.registerLoading=!0,await this.$api.user.register(s),this.$message.success("注册成功，请登录"),this.registerVisible=!1,this.registerForm.resetFields()}catch(s){this.$message.error(s.message||"注册失败")}finally{this.registerLoading=!1}},compareToFirstPassword(s,r,e){const a=this.registerForm;r&&r!==a.getFieldValue("password")?e("两次输入的密码不一致!"):e()}}};var m=function(){var r=this,e=r._self._c;return e("div",{staticClass:"login-container"},[e("div",{staticClass:"login-box"},[r._m(0),e("a-form",{staticClass:"login-form",attrs:{form:r.form},on:{submit:r.handleSubmit}},[e("a-form-item",[e("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["username",{rules:[{required:!0,message:"请输入用户名!"}],validateTrigger:"blur"}],expression:`[
            'username',
            {
              rules: [{ required: true, message: '请输入用户名!' }],
              validateTrigger: 'blur'
            }
          ]`}],attrs:{size:"large",placeholder:"用户名"}},[e("a-icon",{attrs:{slot:"prefix",type:"user"},slot:"prefix"})],1)],1),e("a-form-item",[e("a-input-password",{directives:[{name:"decorator",rawName:"v-decorator",value:["password",{rules:[{required:!0,message:"请输入密码!"}],validateTrigger:"blur"}],expression:`[
            'password',
            {
              rules: [{ required: true, message: '请输入密码!' }],
              validateTrigger: 'blur'
            }
          ]`}],attrs:{size:"large",placeholder:"密码"}},[e("a-icon",{attrs:{slot:"prefix",type:"lock"},slot:"prefix"})],1)],1),e("a-form-item",[e("a-checkbox",{directives:[{name:"decorator",rawName:"v-decorator",value:["remember",{valuePropName:"checked",initialValue:!0}],expression:`[
            'remember',
            {
              valuePropName: 'checked',
              initialValue: true
            }
          ]`}]},[r._v(" 记住我 ")]),e("a",{staticClass:"login-form-forgot",attrs:{href:""}},[r._v(" 忘记密码? ")])],1),e("a-form-item",[e("a-button",{staticClass:"login-form-button",attrs:{type:"primary","html-type":"submit",size:"large",loading:r.loading}},[r._v(" 登录 ")])],1),e("div",{staticClass:"login-options"},[e("a-button",{attrs:{type:"link"},on:{click:r.showRegister}},[r._v(" 还没有账号？立即注册 ")])],1)],1)],1),e("a-modal",{attrs:{title:"用户注册",confirmLoading:r.registerLoading},on:{ok:r.handleRegister},model:{value:r.registerVisible,callback:function(a){r.registerVisible=a},expression:"registerVisible"}},[e("a-form",{attrs:{form:r.registerForm,layout:"vertical"}},[e("a-form-item",{attrs:{label:"用户名"}},[e("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["username",{rules:[{required:!0,message:"请输入用户名!"}]}],expression:`[
            'username',
            { rules: [{ required: true, message: '请输入用户名!' }] }
          ]`}],attrs:{placeholder:"请输入用户名"}})],1),e("a-form-item",{attrs:{label:"邮箱"}},[e("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["email",{rules:[{required:!0,message:"请输入邮箱!"},{type:"email",message:"请输入有效的邮箱地址!"}]}],expression:`[
            'email',
            { 
              rules: [
                { required: true, message: '请输入邮箱!' },
                { type: 'email', message: '请输入有效的邮箱地址!' }
              ] 
            }
          ]`}],attrs:{placeholder:"请输入邮箱"}})],1),e("a-form-item",{attrs:{label:"密码"}},[e("a-input-password",{directives:[{name:"decorator",rawName:"v-decorator",value:["password",{rules:[{required:!0,message:"请输入密码!"}]}],expression:`[
            'password',
            { rules: [{ required: true, message: '请输入密码!' }] }
          ]`}],attrs:{placeholder:"请输入密码"}})],1),e("a-form-item",{attrs:{label:"确认密码"}},[e("a-input-password",{directives:[{name:"decorator",rawName:"v-decorator",value:["confirmPassword",{rules:[{required:!0,message:"请确认密码!"},{validator:this.compareToFirstPassword}]}],expression:`[
            'confirmPassword',
            { 
              rules: [
                { required: true, message: '请确认密码!' },
                { validator: this.compareToFirstPassword }
              ] 
            }
          ]`}],attrs:{placeholder:"请确认密码"}})],1)],1)],1)],1)},u=[function(){var s=this,r=s._self._c;return r("div",{staticClass:"login-header"},[r("h1",[s._v("AI提示词管理系统")]),r("p",[s._v("欢迎使用，请登录您的账号")])])}],d=n(l,m,u,!1,null,"c36e469e",null,null);const f=d.exports;export{f as default};
