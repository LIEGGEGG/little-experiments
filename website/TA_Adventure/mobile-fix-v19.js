// TA Adventure v19 mobile patch: TOC interaction + stable graph viewport + touch selection
(function(){
  function isMobileV19(){return !!(window.matchMedia&&matchMedia('(max-width:720px)').matches)}

  function toggleMobileTOC(force){
    const side=document.getElementById('bookSidebar');
    const state=document.getElementById('mobileTocState');
    const btn=side?.querySelector('.mobile-toc-toggle');
    if(!side)return false;
    const next=typeof force==='boolean'?force:!side.classList.contains('mobile-open');
    side.classList.toggle('mobile-open',next);
    if(state)state.textContent=next?'收起':'展开';
    if(btn)btn.setAttribute('aria-expanded',next?'true':'false');
    return next;
  }
  function closeMobileTOC(){return toggleMobileTOC(false)}
  window.toggleMobileTOC=toggleMobileTOC;
  window.closeMobileTOC=closeMobileTOC;

  function stabilizeGraphMobileV19(){
    if(!isMobileV19())return;
    const wrap=document.querySelector('#panel-graph .graph-canvas-wrap');
    if(!wrap)return;
    wrap.style.width='100%';
    wrap.style.maxWidth='100%';

    const hasSelection=typeof graphSelected!=='undefined'&&!!graphSelected;
    if(!hasSelection&&wrap.scrollLeft===0&&typeof graphTermsV11==='function'&&typeof termCurrent==='function'&&typeof GRAPH_POS!=='undefined'){
      const current=graphTermsV11().find(o=>termCurrent(o.term)&&GRAPH_POS[o.term]);
      if(current){
        const p=GRAPH_POS[current.term];
        const graphW=typeof GRAPH_W_V8==='number'?GRAPH_W_V8:960;
        requestAnimationFrame(()=>{wrap.scrollLeft=Math.max(0,p[0]*(960/graphW)-wrap.clientWidth*.42)});
      }
    }
  }
  window.stabilizeGraphMobileV19=stabilizeGraphMobileV19;

  function bindMobileGraphTapV19(){
    if(!isMobileV19())return;
    const canvas=document.getElementById('graphCanvas');
    if(!canvas||canvas.dataset.mobileTapV19==='1')return;
    canvas.dataset.mobileTapV19='1';
    let start=null;
    canvas.addEventListener('touchstart',e=>{
      if(e.touches.length!==1){start=null;return}
      const t=e.touches[0];start={x:t.clientX,y:t.clientY};
    },{passive:true});
    canvas.addEventListener('touchend',e=>{
      if(!start||e.changedTouches.length!==1){start=null;return}
      const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;
      start=null;
      // A short stationary tap selects; a drag remains native horizontal graph panning.
      if(Math.hypot(dx,dy)>12)return;
      if(typeof graphPointerV8!=='function'||typeof setGraphTermV11!=='function')return;
      const h=graphPointerV8({clientX:t.clientX,clientY:t.clientY});
      e.preventDefault();
      if(h)setGraphTermV11(h.term);else setGraphTermV11(null);
    },{passive:false});
    canvas.addEventListener('touchcancel',()=>{start=null},{passive:true});
  }
  window.bindMobileGraphTapV19=bindMobileGraphTapV19;

  if(typeof startGraph==='function'){
    const startGraphBaseV19=startGraph;
    startGraph=function(){
      startGraphBaseV19.apply(this,arguments);
      requestAnimationFrame(()=>{stabilizeGraphMobileV19();bindMobileGraphTapV19()});
    };
  }

  window.addEventListener('resize',()=>{
    if(typeof currentView!=='undefined'&&currentView==='graph')requestAnimationFrame(()=>{stabilizeGraphMobileV19();bindMobileGraphTapV19()});
  });

  const init=()=>{
    const tocButton=document.querySelector('#bookSidebar .mobile-toc-toggle');
    if(tocButton){
      tocButton.removeAttribute('onclick');
      tocButton.setAttribute('aria-expanded','false');
      tocButton.addEventListener('click',function(event){
        event.preventDefault();
        event.stopPropagation();
        toggleMobileTOC();
      });
    }
    bindMobileGraphTapV19();
    if(typeof currentView!=='undefined'&&currentView==='graph')requestAnimationFrame(stabilizeGraphMobileV19);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
