for(g=0,s(0),t(1),r=6;r>0;r--){for(h="",c=1;c<8;c++)h+='<td id="c'+r+c+'" class="b" onclick="m('+c+')">';e("b").innerHTML+="<tr>"+h+"</tr>"}function m(c){if(g&&(location=""),r=u(c),z("c"+r+c,n()),o(0,1)||o(1,0)||o(1,1)||o(1,-1))t(3);else{for(s(1-p),t(2),c=1;c<8;c++)if(u(c))return;t(4)}function o(t,o){for(i=-3;i<4;i++)if(count=f(r+t*i,c+o*i)==n()?++count:0,count>3)return 1}function u(n){for(r=1;r<7;r++)if("b"==f(r,n))return r}function f(n,r){return n<1||r<1||n>6||r>7?0:e("c"+n+r).className}g=1}function n(){return"p"+p}function s(r){p=r,z("p",n())}function t(n){z("m","m"+n)}function e(n){return document.querySelector("#"+n)}function z(n,r){e(n).className=r}