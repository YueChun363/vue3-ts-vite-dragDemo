<template>
      <div class="drag-div-container" >
    <div class="drag-element"   @mousedown.self="moveElement"  :ref="getElement" >
      <template v-if="isShowEditor" >
        <div class="editor editor-left" @mousedown="computeChange($event, editorTypeEnum.left)" ></div>
        <div class="editor editor-left-top" @mousedown="computeChange($event, editorTypeEnum.leftTop)" ></div>
        <div class="editor editor-top" @mousedown="computeChange($event, editorTypeEnum.top)" ></div>
        <div class="editor editor-right-top" @mousedown="computeChange($event, editorTypeEnum.rightTop)" ></div>
        <div class="editor editor-right" @mousedown="computeChange($event, editorTypeEnum.right)" ></div>
        <div class="editor editor-right-bottom" @mousedown="computeChange($event, editorTypeEnum.rightBottom)" ></div>
        <div class="editor editor-bottom" @mousedown="computeChange($event, editorTypeEnum.bottom)"> </div>
        <div class="editor editor-left-bottom" @mousedown="computeChange($event, editorTypeEnum.leftBottom)" ></div>
        <div class="rotate" @mousedown="rotateElement"  >
          <svg t="1639554221774" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2040" 
          width="16" height="16"><path d="M961.45 362.18V137.45l-96.93 96.93C781.45 128.89 652.62 61.16 507.58 62.57 271.24 64.85 72.15 257.78 62.9 493.94 52.86 750.39 257.78 961.45 512 961.45c166.26 0 311.09-90.52 388.83-224.73h-43.78C775.39 861.87 627.8 940.06 463.37 921.2c-187.7-21.52-339.93-174.33-360.76-362.11C75.05 310.47 268.94 100 512 100c132.91 0 250.39 63.49 325.7 161.21L736.73 362.18h224.72z" fill="#595959" p-id="2041"></path></svg>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" >
import PositionMinxin from './PostionMixin';
import GeometricMinxin from './GeometricMinxin';
import {onClickOutside} from '@vueuse/core'
import {ref} from 'vue';
import {editorTypeEnum} from '../Enum/EditorTypeEnum'
export default {
    name: 'DragElement',
    setup() {
        let postionMinxin = PositionMinxin.setup();
        let geometricMinxin = GeometricMinxin.setup();

        let isShowEditor = ref(false);
        let elementRef = ref(null);
        const getElement = el=> {
            elementRef.value = el;
        }
        onClickOutside(elementRef,()=>isShowEditor.value = false);

        // 移动元素
        let moveElement = (event:MouseEvent)=> {
            isShowEditor.value = true;
            return postionMinxin.drag(event);
        }

        // 旋转元素 
        let rotateElement = (event: MouseEvent)=>{
            postionMinxin.transformRotate(event, elementRef.value); 
        } 

        // 拉伸元素
        let computeChange = (event:MouseEvent, type:editorTypeEnum)=> {
          event.stopPropagation();
              geometricMinxin.changeGeometric(event, 
              {
                rotate: postionMinxin.rotate.value,
                left: postionMinxin.left.value,
                top: postionMinxin.top.value, 
              }, 
              type, 
              (beforeHeight:number, beforeWidth:number, afterHeight:number, afterWidth:number)=>{
                  postionMinxin.clearPostionChange(type, beforeHeight, beforeWidth, afterHeight, afterWidth);
              });
        }

        return {
            ...postionMinxin,
            ...geometricMinxin,
            getElement,
            isShowEditor,
            moveElement,
            rotateElement,
            computeChange,
            editorTypeEnum,
        }
    }

}
</script>

<style scoped >
.drag-element {
  position: absolute;
  transform: rotate(v-bind(rotateCss));
  width: v-bind(widthCss);
  height: v-bind(heightCss);
  left: v-bind(leftCss);
  top: v-bind(topCss);
  background: greenyellow;
  cursor: pointer;
}
.editor{
  position: absolute;
  width: 8px;
  height: 8px;
  border:1px solid rgba(0,0,0,.8);
  border-radius: 8px;
  /* background: white; */
}
.rotate{
  position: absolute;
  left: 50%;
  transform: translate(-50%,-150%);
}
.editor-left-top,
.editor-right-bottom
{
 cursor: se-resize;
}
.editor-right-top,
.editor-left-bottom{
  cursor: sw-resize;
}
.editor-left, 
.editor-left-top,
.editor-left-bottom{
      left: 0;
}
.editor-right,
.editor-right-top,
.editor-right-bottom{
    right: 0;
}
.editor-left-bottom,
.editor-right-bottom,
.editor-bottom{
  bottom: 0;
}
.editor-top,
.editor-left-top,
.editor-right-top{
  top:0;
}
.editor-top,
.editor-bottom{
  left: 50%;
  cursor: s-resize;
}
.editor-left,
.editor-right{
  top: 50%;
  cursor: e-resize;
}
.editor-left,
.editor-left-top,
.editor-top{
  transform: translate(-50%, -50%);
}
.editor-right,
.editor-right-top{
  transform: translate(50%, -50%);
}
.editor-right-bottom{
  transform: translate(50%, 50%);
}
.editor-left-bottom,
.editor-bottom{
  transform: translate(-50%, 50%);
}
</style>