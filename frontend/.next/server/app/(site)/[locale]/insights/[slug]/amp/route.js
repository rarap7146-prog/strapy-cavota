"use strict";(()=>{var a={};a.id=623,a.ids=[623],a.modules={261:a=>{a.exports=require("next/dist/shared/lib/router/utils/app-paths")},10846:a=>{a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:a=>{a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},29754:(a,b,c)=>{c.r(b),c.d(b,{handler:()=>D,patchFetch:()=>C,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var d={};c.r(d),c.d(d,{GET:()=>x,revalidate:()=>w});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(78644),v=c(19587);let w=300;async function x(a,b){let{locale:c,slug:d}=await b.params;try{let a=await u.T.getInsightBySlug(d,c,{hero_image:{populate:"*"},seo:{populate:"*"},tags:!0,author:!0},{next:{tags:[`insight:${d}:${c}`],revalidate:300}});if(!a)return new Response("Insight not found",{status:404,headers:{"content-type":"text/html; charset=utf-8"}});let b=function(a,b){let c="id"===b?{backToInsights:"Kembali ke Wawasan",by:"Oleh",readTime:"menit baca",ctaTitle:"Tertarik bekerja sama?",ctaDescription:"Mari diskusikan bagaimana CAVOTA dapat membantu bisnis Anda berkembang.",ctaButton:"Hubungi Kami",copyright:"\xa9 2025 CAVOTA. Semua hak dilindungi."}:{backToInsights:"Back to Insights",by:"By",readTime:"min read",ctaTitle:"Interested in working together?",ctaDescription:"Let's discuss how CAVOTA can help your business grow.",ctaButton:"Contact Us",copyright:"\xa9 2025 CAVOTA. All rights reserved."},d="https://cavota.id",e=`${d}/${b}/insights/${a.slug}`,f=`${d}/${b}/insights/${a.slug}/amp`,g=(0,v.JB)(a.body),h=(0,v.ER)(g),i=a.hero_image?(0,v.L)(a.hero_image,"cover"):"",j=a.tags&&a.tags.length>0?`
    <div class="tags">
      ${a.tags.map(a=>`<span class="tag">${a.name}</span>`).join("")}
    </div>
  `:"",k=a.seo?.metaTitle||a.title,l=a.seo?.metaDescription||a.summary||`Insight tentang ${a.title}`,m=(0,v.IC)(),n=function(a,b){let c="https://cavota.id",d=`${c}/${b}/insights/${a.slug}`,e=a.hero_image?a.hero_image.url.startsWith("/")?`${c}${a.hero_image.url}`:a.hero_image.url:`${c}/favicon.png`;return JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:a.title,description:a.seo?.metaDescription||a.summary||`Insight tentang ${a.title}`,datePublished:a.publishedAt,dateModified:a.updatedAt,author:{"@type":"Person",name:a.author?.name||"CAVOTA"},publisher:{"@type":"Organization",name:"CAVOTA",logo:{"@type":"ImageObject",url:`${c}/favicon.png`}},image:[e],mainEntityOfPage:{"@type":"WebPage","@id":d}})}(a,b),o=function(a,b){let c=new Date(a),d={year:"numeric",month:"long",day:"numeric"};try{return c.toLocaleDateString("id"===b?"id-ID":"en-US",d)}catch{return c.toLocaleDateString("en-US",d)}}(a.publishedAt,b),p=a.reading_time?`${a.reading_time} ${c.readTime}`:"";return`<!doctype html>
<html ⚡ lang="${b}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <link rel="canonical" href="${e}">
  <title>${k}</title>
  <meta name="description" content="${l.replace(/"/g,"&quot;")}">
  ${a.seo?.keywords?`<meta name="keywords" content="${a.seo.keywords}">`:""}
  <meta property="og:title" content="${k}">
  <meta property="og:description" content="${l.replace(/"/g,"&quot;")}">
  <meta property="og:url" content="${f}">
  <meta property="og:type" content="article">
  ${a.hero_image?`<meta property="og:image" content="${a.hero_image.url.startsWith("/")?d+a.hero_image.url:a.hero_image.url}">`:""}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${k}">
  <meta name="twitter:description" content="${l.replace(/"/g,"&quot;")}">
  ${a.hero_image?`<meta name="twitter:image" content="${a.hero_image.url.startsWith("/")?d+a.hero_image.url:a.hero_image.url}">`:""}
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  ${h.join("\n  ")}
  <style amp-custom>
${m}
  </style>
  <script type="application/ld+json">
${n}
  </script>
</head>
<body>
  <div class="container">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <a href="/${b}/insights">${c.backToInsights}</a>
    </nav>

    <!-- Article Header -->
    <header class="article-header">
      <h1>${a.title}</h1>
      
      <div class="article-meta">
        <span class="author">${c.by} ${a.author?.name||"CAVOTA"}</span>
        <span> • </span>
        <time datetime="${a.publishedAt}">${o}</time>
        ${p?`<span> • </span><span>${p}</span>`:""}
      </div>
      
      ${j}
    </header>

    <!-- Cover Image -->
    ${i}

    <!-- Article Body -->
    <article class="article-body">
      ${g}
    </article>

    <!-- CTA Strip -->
    <section class="cta-strip">
      <h3>${c.ctaTitle}</h3>
      <p>${c.ctaDescription}</p>
      <a href="/${b}/contact" class="cta-button">${c.ctaButton}</a>
    </section>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <p>${c.copyright}</p>
    </div>
  </footer>
</body>
</html>`}(a,c);return new Response(b,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"public, s-maxage=300, stale-while-revalidate=600",vary:"Accept-Encoding"}})}catch(a){return console.error("AMP Route Error:",a),new Response("Internal Server Error",{status:500,headers:{"content-type":"text/html; charset=utf-8"}})}}let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/(site)/[locale]/insights/[slug]/amp/route",pathname:"/[locale]/insights/[slug]/amp",filename:"route",bundlePath:"app/(site)/[locale]/insights/[slug]/amp/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/var/www/linkgacor.one/frontend/app/(site)/[locale]/insights/[slug]/amp/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function C(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function D(a,b,c){var d;let e="/(site)/[locale]/insights/[slug]/amp/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},44870:a=>{a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},86439:a=>{a.exports=require("next/dist/shared/lib/no-fallback-error.external")}};var b=require("../../../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[873,771],()=>b(b.s=29754));module.exports=c})();