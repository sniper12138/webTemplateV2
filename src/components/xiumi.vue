<template>
  <div class="editor">
    <div class="main">
      <div class="left">
        <vue-ueditor-wrap
          v-model="textAreaVal"
          :config="ueditorConfig"
          :destroy="true"
          @before-init="addCustomButtom"
          @ready="ueditorReady"
        ></vue-ueditor-wrap>
      </div>
      <div class="right">
        <div class="preview-main">
          <div class="preview">
            <div class="navbar-icon">
              <div class="navbar-date">{{ nowDate }}</div>
              <img class="" src="../assets/image/navbar-icon.png" alt="" />
            </div>
            <div class="preview-view">
              <vue-scroll ref="Vs" :ops="VsOpts">
                <div class="content" v-html="textAreaVal"></div>
              </vue-scroll>
            </div>
            <div class="footer">
              <div class="line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="create-btn">
      <Button type="primary" @click="createPageModalShow = true">生成</Button>
    </div>

    <Modal
      title="页面标题"
      v-model="createPageModalShow"
      @on-ok="getCreatePage"
    >
      <h3 style="margin-bottom: 20px">请输入页面标题</h3>
      <Input v-model="createPageTitle" />
      <div slot="footer">
        <Button type="primary" @click="getCreatePage">确认</Button>
        <Button @click="hideCreateModal">取消</Button>
      </div>
    </Modal>
    <!-- <quillEditor  v-model="textAreaVal"/> -->
  </div>
</template>

<script>
import VueUeditorWrap from "vue-ueditor-wrap";
import vueScroll from "vuescroll";
// import { quillEditor } from "vue-quill-xiumi";
export default {
  name: "editor",
  components: {
    VueUeditorWrap,
    vueScroll,
    // quillEditor,
  },
  data() {
    return {
      textAreaVal: "",
      ueditorConfig: {
        toolbars: [
          [
            "undo",
            "redo",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "forecolor",
            "justifyleft",
            "justifyright",
            "justifycenter",
            "justifyjustify",
            "insertorderedlist",
            "insertunorderedlist",
            "blockquote",
            "horizontal",
            "xiumi-connect",
          ],
        ],
        autoHeightEnabled: false,
        initialFrameHeight: 600,
        serverUrl: "",
        UEDITOR_HOME_URL:
          process.env.NODE_ENV !== "development"
            ? window.location.pathname + "UEditor/"
            : "/UEditor/",
      },
      VsOpts: {
        vuescroll: {
          //slide滚轮会缩放
          mode: "native",
        },
        scrollPanel: {
          scrollingX: false,
        },
        rail: {},
        bar: {},
      },
      ueditor: null,
      timer: null,
      nowDate: "",
      createPageTitle: "",
      createPageModalShow: false,
    };
  },
  mounted() {
    this.initNowDate();
    UE.registerUI("dialog", function (editor, uiName) {});
  },
  destroyed() {
    this.removeNowDate();
  },
  methods: {
    ueditorReady(editorInt) {
      this.ueditor = editorInt;
    },
    getDate() {
      let hour = new Date().getHours();
      let minutes =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      this.nowDate = hour + ":" + minutes;
    },
    initNowDate() {
      this.getDate();
      this.timer = setInterval(() => {
        this.getDate();
      }, 5000);
    },
    removeNowDate() {
      clearInterval(this.timer);
    },
    addCustomButtom(editorId) {
      window.UE.registerUI("dialog", function (editor, uiName) {
        var btn = new window.UE.ui.Button(
          {
            name: "xiumi-connect",
            title: "秀米",
            onclick: function () {
              var dialog = new window.UE.ui.Dialog({
                iframeUrl: process.env.NODE_ENV == "development"? "../UEditor/xiumi-ue-dialog-v5.html" : window.location.pathname + "UEditor/xiumi-ue-dialog-v5.html",
                editor: editor,
                name: "xiumi-connect",
                title: "秀米图文消息助手",
                cssRules:
                  "width: " +
                  (window.innerWidth - 60) +
                  "px;" +
                  "height: " +
                  (window.innerHeight - 60) +
                  "px;",
              });
              dialog.render();
              dialog.open();
            },
          },
          0,
          editorId
        );
        return btn;
      });
    },
    getCreatePage() {
      if (this.createPageTitle.trim() == "") {
        this.$Message.error("请输入页面标题");
        return false;
      }
      this.createPageModalShow = false;
      this.colEditBtnShow = false;
      setTimeout(() => {
        let html = this.createPageHtml();
        const _this = this;
        this.$Modal.confirm({
          width: 800,
          okText: "下载",
          render: (h) => {
            return h(
              "pre",
              {
                style: {
                  minHeight: "500px",
                  overflowY: "auto",
                },
              },
              html
            );
          },
          onOk() {
            _this.download("index.html", html);
            _this.createPageTitle = "";
          },
          onCancel() {
            _this.createPageTitle = "";
          },
        });
      }, 200);
    },
    getHttpStatus() {
      return document.location.protocol == "https:" ? "https:" : "http:";
    },
    createPageHtml() {
      let html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, minimal-ui, viewport-fit=cover">
            <link rel="stylesheet" href="${this.getHttpStatus()}//cdn.tinytiger.cn/20201021/base.css">
            <script src="${this.getHttpStatus()}//cdn.tinytiger.cn/20201016/rem.js"></\script>
            <style>
              * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
              }
              .w{
                width: 1280px;
                margin: 0 auto;
              }
              @media screen and (max-width: 760px) {
                .w{
                  width: 100%;
                }
              }
            </style>
            <title>${this.createPageTitle}</title>
          </head>
          <body>
            <div class="w">
            ${this.textAreaVal}
            </div>
          </body>
        </html>`;
      return html;
    },
    download(filename, text) {
      var pom = document.createElement("a");
      pom.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      pom.setAttribute("download", filename);
      if (document.createEvent) {
        var event = document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        pom.dispatchEvent(event);
      } else {
        pom.click();
      }
    },
    hideCreateModal() {
      this.createPageTitle = "";
      this.createPageModalShow = false;
    },
  },
};
</script>

<style scoped lang="less">
.editor {
  display: flex;
  flex-direction: column;
  padding: 40px 0 0;
  .main {
    display: flex;
    .left {
      width: 70%;
      padding: 0 20px;
    }
    .right {
      width: 30%;
      .preview-main {
        display: flex;
        align-items: center;
        justify-content: center;
        .preview {
          display: flex;
          flex-direction: column;
          width: 233px;
          height: 504px;
          background: #ffffff;
          border-radius: 14px;
          padding: 10px 0 6px;
          .navbar-icon {
            display: block;
            width: 205px;
            height: 9.5px;
            margin: 0 auto;
            position: relative;
            img {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
            }
            .navbar-date {
              font-size: 12px;
              color: #000;
              position: absolute;
              top: -5px;
              left: -3px;
            }
          }
          .preview-view {
            flex: 1;
            overflow: auto;
            .content {
              // height: 100%;
            }
          }
          .footer {
            .line {
              width: 88px;
              height: 3px;
              background: #000;
              margin: 0 auto;
              border-radius: 9px;
            }
          }
        }
      }
    }
  }
  .create-btn {
    padding: 20px 0 0;
  }
}
</style>
