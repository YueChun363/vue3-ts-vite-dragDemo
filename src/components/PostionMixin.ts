// 元素位置信息控制
import { ref, computed } from "vue";
import {editorTypeEnum} from '../Enum/EditorTypeEnum'
export default  {
    setup() {
        //元素定位信息
        let left = ref(200);
        let top = ref(80);
        let rotate = ref(0);
        let leftCss = computed(()=>left.value + 'px');
        let topCss = computed(()=>top.value + 'px');
        let rotateCss = computed(()=>rotate.value + 'rad');

        // 元素拖动
        const drag = event=> {
            // 获取移动之前鼠标点的位置
            let startPoint = {
                x: event.clientX,
                y: event.clientY,
            }
            document.onmousemove = (e:MouseEvent)=> {
                // 获取移动后鼠标点位置
                let endPoint = {
                    x: e.clientX,
                    y: e.clientY,
                }
                left.value += (endPoint.x - startPoint.x);
                top.value += (endPoint.y - startPoint.y);
                // 更新初始点
                startPoint = {...endPoint}; 
            }
            // 鼠标上抬取消移动
            document.onmouseup = ()=> {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }

        // 元素旋转
        const transformRotate = (event:MouseEvent, el:HTMLElement)=> {
            // 获取元素中心点
            const centerPonit = {
                x: left.value + el.clientWidth/2,
                y: top.value + el.clientHeight/2,
            }
            document.onmousemove = (event:MouseEvent)=> {
                // 获取旋转后鼠标位置
                let mousePoint = {
                    x: event.clientX,
                    y: event.clientY,
                }
                // 将鼠标位置点信息换算成以元素中心点为坐标原点的坐标系
                // 计算与x正轴夹角弧度
                // 加上原本旋转点与x正轴的Π/2，因为atan2是负角度
                // atan2 方法返回一个 -pi 到 pi 之间的数值，表示点 (x, y) 对应的偏移角度。这是一个逆时针角度，以弧度为单位，正X轴和点 (x, y) 与原点连线 之间。注意此函数接受的参数：先传递 y 坐标，然后是 x 坐标。
                rotate.value = Math.atan2(mousePoint.y - centerPonit.y, mousePoint.x - centerPonit.x) + Math.PI/2;
            }
            document.onmouseup = ()=> {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
        // 获取旋转后的点坐标
        const getRotatePoint = (targetPoint, centerPoint)=> {
            return rotate.value < 0? 
            {
                x: (targetPoint.x - centerPoint.x)*Math.cos(rotate.value + Math.PI*2) - (targetPoint.y - centerPoint.y)*Math.sin(rotate.value + Math.PI*2) + centerPoint.x,
                y: (targetPoint.y - centerPoint.y)*Math.cos(rotate.value + Math.PI*2) + (targetPoint.x - centerPoint.x)*Math.sin(rotate.value + Math.PI*2) + centerPoint.y
            } 
            : {
                x: (targetPoint.x - centerPoint.x)*Math.cos(rotate.value) - (targetPoint.y - centerPoint.y)*Math.sin(rotate.value) + centerPoint.x,
                y: (targetPoint.y - centerPoint.y)*Math.cos(rotate.value) + (targetPoint.x - centerPoint.x)*Math.sin(rotate.value) + centerPoint.y
            }
        }

        // 清除拉升后参考点的变化
        const clearPostionChange = (editorType: editorTypeEnum, beforeHeight:number, beforeWidth:number, afterHeight:number, afterWidth:number)=> {
            let startPoint = getReferPoint(editorType, beforeHeight, beforeWidth);
            let endPoint = getReferPoint(editorType, afterHeight, afterWidth);
            top.value += (startPoint.y - endPoint.y);
            left.value += (startPoint.x - endPoint.x);
        }
        // 获取参考点
        const getReferPoint = (editorType: editorTypeEnum, height:number, width:number)=> {
            let referencePoint : {
                [key: string]:number,
            }
            let centerPonit = {x: left.value + width/2, y: top.value + height/2};
            switch(editorType){
                case editorTypeEnum.top:
                    referencePoint = getRotatePoint({x: left.value + width/2, y: top.value + height }, centerPonit);
                    break;
                case editorTypeEnum.rightTop:
                    referencePoint = getRotatePoint({x: left.value, y: top.value + height }, centerPonit);
                    break;
                case editorTypeEnum.right:
                    referencePoint = getRotatePoint({x: left.value, y: top.value + height/2 }, centerPonit);
                    break;
                case editorTypeEnum.rightBottom:
                    referencePoint = getRotatePoint({x: left.value, y: top.value}, centerPonit);
                    break;
                case editorTypeEnum.bottom:
                    referencePoint = getRotatePoint({x: left.value + width/2, y: top.value }, centerPonit);
                    break;
                case editorTypeEnum.leftBottom:
                    referencePoint = getRotatePoint({x: left.value + width, y: top.value }, centerPonit);
                    break;
                case editorTypeEnum.left:
                    referencePoint = getRotatePoint({x: left.value + width, y: top.value + height/2 }, centerPonit);
                    break;
                case editorTypeEnum.leftTop:
                    referencePoint = getRotatePoint({x: left.value + width, y: top.value + height }, centerPonit);
                    break;
            }
            return referencePoint;
        }

        return {
            left,
            top,
            rotate,
            leftCss,
            topCss,
            rotateCss,
            drag,
            transformRotate,
            clearPostionChange,
        }
    }
}