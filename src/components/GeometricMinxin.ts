// 元素几何信息
import { ref, computed } from "vue";
import {editorTypeEnum} from '../Enum/EditorTypeEnum'
// 参考线上方需要修改高的编辑器
const topHeightEditors =  [editorTypeEnum.top, editorTypeEnum.leftTop, editorTypeEnum.rightTop];
// 参考线下方需要修改高的编辑器
const bottomHeightEditors =  [editorTypeEnum.bottom, editorTypeEnum.leftBottom, editorTypeEnum.rightBottom];
// 参考线左方需要修改宽的编辑器
const leftWidthEditors =  [editorTypeEnum.left, editorTypeEnum.leftTop, editorTypeEnum.leftBottom];
// 参考线下方需要修改宽的编辑器
const rightWidthEditors =  [editorTypeEnum.right, editorTypeEnum.rightBottom, editorTypeEnum.rightTop];

export default {
    setup() {
        let height = ref(80);
        let width = ref(200);
        let heightCss = computed(()=> height.value + 'px');
        let widthCss = computed(()=> width.value + 'px');
        
        //拉伸
        const changeGeometric = (event: MouseEvent, elementPostion: {rotate:number, left:number, top:number}, editorType:editorTypeEnum, callback)=> {
            
            // 水平参考线系数
                let horizontalLineCoe: number = Math.tan(elementPostion.rotate);
                // 水平参考线偏移
                let horizontalLineOff:number = elementPostion.top + height.value/2 - horizontalLineCoe*(elementPostion.left + width.value/2);
                // 垂直参考线系数
                let verticalLineCoe:number = Math.tan(elementPostion.rotate + Math.PI/2);
                // 垂直参考线偏移
                let verticalLineOff:number = elementPostion.top + height.value/2 - verticalLineCoe*(elementPostion.left + width.value/2);
                let startHeight = height.value;
                let startWidth = width.value;
            document.onmousemove = (e: MouseEvent)=> {
                
                //拉升之前高宽
                let beforeHeight = height.value;
                let beforeWidth = width.value;
                // 计算变化的高宽
                if (topHeightEditors.includes(editorType) || bottomHeightEditors.includes(editorType)) {
                    
                    let distance = Math.abs(horizontalLineCoe*e.clientX + horizontalLineOff - e.clientY)/Math.sqrt(Math.pow(horizontalLineCoe, 2) + 1);
                
                    // 判断鼠标点位是否在 参考线下方
                    let inBottom = e.clientY - (horizontalLineCoe*e.clientX + horizontalLineOff) > 0;
                    // 判断此时旋转角是否锐角
                    let isSmallRotate = elementPostion.rotate < Math.PI/2;
                    //判断操作点是否为元素下方的编辑点
                    let isBottom = bottomHeightEditors.includes(editorType);
                    console.log(startHeight, isBottom, isSmallRotate, isBottom);
                    if (isBottom) {
                        if(isSmallRotate) {
                            let afterHeight = inBottom?  startHeight/2 + distance : startHeight/2 - distance;
                            if(afterHeight > 0) {
                                height.value = afterHeight;
                            }
                             
                        }else {
                            let afterHeight = inBottom? startHeight/2 - distance : startHeight/2 + distance;
                            if (afterHeight > 0) {
                                height.value =  afterHeight;
                            }

                        }
    
                    }else {
                        if(isSmallRotate) {
                            let afterHeight = inBottom? startHeight/2 - distance : startHeight/2 + distance;
                            if (afterHeight > 0) {
                                height.value = afterHeight;
                            }
                        }else {
                            let afterHeight = inBottom? startHeight/2 + distance : startHeight/2 - distance;
                            if (afterHeight > 0) {
                                height.value = afterHeight;
                            }
                        }
                    }
                    

                }
                if (leftWidthEditors.includes(editorType) || rightWidthEditors.includes(editorType)) {

                    let distance = Math.abs(verticalLineCoe*e.clientX + verticalLineOff - e.clientY)/Math.sqrt(Math.pow(verticalLineCoe, 2) + 1);
                    // 判断鼠标点位是否在参考线右边
                    let inRight = e.clientX - (e.clientY - verticalLineOff)/verticalLineCoe > 0;
                    let isSmallRotate = elementPostion.rotate < Math.PI/2;
                    let isRight = rightWidthEditors.includes(editorType);
                    let afterWidth = -1;
                    if (isRight) {
                        if (isSmallRotate) {
                            afterWidth = inRight? startWidth/2 + distance : startWidth/2 - distance;
                        }else {
                            afterWidth = inRight?  startWidth/2 - distance : startWidth/2 + distance;
                        }
                    }else {
                        if (isSmallRotate) {
                            afterWidth = inRight? startWidth/2 - distance : startWidth/2 + distance;
                        }else {
                            afterWidth = inRight?  startWidth/2 + distance : startWidth/2 - distance;
                        }
                    }
                    if(afterWidth > 0) {
                        width.value = afterWidth;
                    }
                }
                callback(beforeHeight, beforeWidth, height.value, width.value);
            }
            document.onmouseup = ()=> {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }

        return {
            heightCss,
            widthCss,
            height,
            width,
            changeGeometric,
        }
    }
}