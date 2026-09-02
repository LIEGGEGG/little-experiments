// TA Adventure v19 mobile-only fix: TOC interaction + stable graph viewport
(function(){
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
    if(!window.matchMedia||!matchMedia('(max-width:720px)').matches)return;
    const wrap=document.querySelector('#panel-graph .graph-canvas-wrap');
    if(!wrap)return;
    wrap.style.width='100%';
    wrap.style.maxWidth='100%';

    // GRAPH_POS / GRAPH_W_V8 / graphSelected / currentView are global lexical
    // bindings in the source document (let/const), so read them by identifier
    // rather than through window.*.
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

  if(typeof startGraph==='function'){
    const startGraphBaseV19=startGraph;
    startGraph=function(){
      startGraphBaseV19.apply(this,arguments);
      requestAnimationFrame(stabilizeGraphMobileV19);
    };
  }

  window.addEventListener('resize',()=>{
    if(typeof currentView!=='undefined'&&currentView==='graph')requestAnimationFrame(stabilizeGraphMobileV19);
  });

  const init=()=>{
    const tocButton=document.querySelector('#bookSidebar .mobile-toc-toggle');
    if(tocButton)tocButton.setAttribute('aria-expanded','false');
    if(typeof currentView!=='undefined'&&currentView==='graph')requestAnimationFrame(stabilizeGraphMobileV19);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
